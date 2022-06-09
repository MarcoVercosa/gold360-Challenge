FROM ubuntu

RUN echo "STARTED"
COPY fileBeat/filebeat-8.2.0-amd64.deb /tmp
RUN cd /tmp && dpkg -i filebeat-8.2.0-amd64.deb

COPY fileBeat/filebeat.yml /etc/filebeat/filebeat.yml
COPY fileBeat/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]