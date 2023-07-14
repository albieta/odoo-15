import logging
from odoo import fields, models, api

_logger = logging.getLogger(__name__)

class resourcesInfrastructure(models.Model):
    _name = "resources.infrastructure"
    _description = "Infrastructures"
    name = fields.Char("Name", required=True)
    description = fields.Html(string="Description")
    home_partner_institution = fields.Many2one("res.partner", string="Home partner institution")
    contact_person = fields.Many2many("res.partner", string="Contact persons")
    equipment = fields.Html("Equipment")
    keywords = fields.Many2many('resources.keyword', string="Keywords")
    technical_staff = fields.Boolean(string="Technical staff available")
    booking_system = fields.Boolean(string="Online booking system available")
    booking_system_details = fields.Char(string="Online booking system details")
    remote_access_policy = fields.Boolean(string="Remote access available")
    remote_access_policy_details = fields.Char(string="Remote access details")
    scientific_domain = fields.Many2many('resources.scientific_domain', string="Scientific domain")
    external_users = fields.Boolean(string="Open to external users")
    image = fields.Binary(string="Image")
    web_link = fields.Char(string="Website", widget="url")

