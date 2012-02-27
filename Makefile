HTTPD = "/etc/rc.d/httpd"
HTTP_ROOT = "/srv/http"

debug:
	jekyll --server

release:
	jekyll

start: release
	sudo cp -fr ./_site/* ${HTTP_ROOT}
	sudo chmod -R +rx ${HTTP_ROOT}/*
	sudo ${HTTPD} start

stop:
	sudo ${HTTPD} stop
