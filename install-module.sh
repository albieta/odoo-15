#!/bin/bash
docker-compose exec -ti odoo /usr/bin/odoo -i $1 --load=base,web,openupgrade_framework

