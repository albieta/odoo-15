from odoo import fields, api, models

class ScientificDomain(models.Model):
    _name = "resources.scientific_domain"
    _description = "Scientific domains"

    name = fields.Char(required=True, translate=True)