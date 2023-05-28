from openupgradelib import openupgrade


def _fill_account_analytic_line_category(env):
    openupgrade.logged_query(
        env.cr,
        """
        UPDATE account_analytic_line aal
        SET category =
            CASE
                WHEN am.move_type IN ('out_invoice', 'out_refund', 'out_receipt')
                THEN 'invoice'
                WHEN am.move_type IN ('in_invoice', 'in_refund', 'in_receipt')
                THEN 'vendor_bill'
                ELSE 'other'
            END
        FROM account_move_line aml
        JOIN account_move am ON am.id = aml.move_id
        WHERE aml.id = aal.move_id""",
    )


def fill_paired_payment(env):
    openupgrade.logged_query(
        env.cr,
        """
        UPDATE account_payment ap
        SET destination_journal_id = aj.id
        FROM account_journal aj, account_move am
        WHERE aj.bank_account_id = ap.partner_bank_id AND ap.is_internal_transfer
            AND ap.move_id = am.id AND am.state = 'posted'
            AND aj.type in ('bank', 'cash') AND aj.id != am.journal_id""",
    )
    payments = env["account.payment"].search(
        [("state", "=", "posted"), ("destination_journal_id", "!=", False)]
    )
    payments_inactive_currency = payments.filtered(
        lambda p: not p.move_id.currency_id.active
    )
    payments_inactive_currency.move_id.currency_id.active = True
    payments.filtered(
        lambda pay: pay.is_internal_transfer
        and not pay.paired_internal_transfer_payment_id
    )._create_paired_internal_transfer_payment()
    payments_inactive_currency.move_id.currency_id.active = False


def set_res_company_account_setup_taxes_state_done(env):
    taxes = env["account.tax"].read_group([], ["company_id"], ["company_id"])
    for tax in taxes:
        company = env["res.company"].browse(tax["company_id"][0])
        company.account_setup_taxes_state = "done"


def _handle_website_legal_page(env):
    """As the terms and conditions page has been added in the 'account' module,
    the information added in the page created by 'website_legal_page' has to be
    transferred to the invoice_terms_html field of the company.
    """
    openupgrade.update_module_names(
        env.cr, [("website_legal_page", "account")], merge_modules=True
    )
    for company in env["res.company"].with_context(active_test=False).search([]):
        openupgrade.logged_query(
            env.cr,
            """
            SELECT iuv.id
            FROM ir_ui_view iuv
                JOIN website w ON w.id = iuv.website_id
            WHERE iuv.key = 'website_legal_page.legal_page' AND w.company_id = %s
            """,
            (company.id,),
        )
        row = env.cr.fetchone()
        if row:
            view = env["ir.ui.view"].browse(row[0])
            view_temp = view.copy(
                # Here we make a trick to add the view content to field, avoiding the
                # call to website.layout to avoid having the layout repeated
                {"arch_db": view.arch.replace('t-call="website.layout"', "")}
            )
            company.write(
                {
                    "terms_type": "html",
                    "invoice_terms_html": view_temp._render({}, engine="ir.qweb"),
                }
            )
            view_temp.unlink()


@openupgrade.migrate()
def migrate(env, version):
    _fill_account_analytic_line_category(env)
    fill_paired_payment(env)
    set_res_company_account_setup_taxes_state_done(env)
    openupgrade.load_data(env.cr, "account", "15.0.1.2/noupdate_changes.xml")
    openupgrade.delete_record_translations(
        env.cr,
        "account",
        [
            "email_template_edi_invoice",
            "mail_template_data_payment_receipt",
        ],
    )
    if env["ir.model.data"].search(
        [("module", "=", "website_legal_page"), ("name", "=", "legal_page")]
    ):
        _handle_website_legal_page(env)
