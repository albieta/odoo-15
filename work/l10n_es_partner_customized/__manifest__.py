# Copyright 2009 Jordi Esteve <jesteve@zikzakmedia.com>
# Copyright 2013 Ignacio Ibeas <ignacio@acysos.com>
# Copyright 2015 Tecnativa - Sergio Teruel
# Copyright 2016 Tecnativa - Carlos Dauden
# Copyright 2013-2018 Tecnativa - Pedro M. Baeza
# License AGPL-3 - See https://www.gnu.org/licenses/agpl-3.0.html

{
    "name": "Commercial name to companies",
    "version": "15.0.1.0.1",
    "author": "ZikZak," "Acysos," "Tecnativa," "Odoo Community Association (OCA)",
    "website": "https://github.com/OCA/l10n-spain",
    "category": "Localisation/Europe",
    "license": "AGPL-3",
    "development_status": "Mature",
    "maintainers": ["pedrobaeza"],
    "external_dependencies": {"python": ["requests"]},
    "data": [
        "data/l10n_es_partner_data.xml",
        "views/res_partner_view.xml",
    ],
    "application": True,
}
