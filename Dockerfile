FROM odoo:15.0

USER root

RUN apt-get update && apt-get install -y git && apt-get install -y python3-pip && pip3 install --upgrade pip
RUN pip install git+https://github.com/OCA/openupgradelib.git@master#egg=openupgradelib
