# Maven Lite
A super light maven repository built with node.

# Getting started
To start the server, simply run 
``
npm start
``

* The server will be hosted at http://localhost:8080
* The reposity files will be stored at ``/maven/``

If you want to change the above, edit lines 6 to 8 of the index.js file.

# Docker Image
A docker image is available at https://cloud.docker.com/repository/docker/hpieterse/maven-lite/. Simply setup a persitent volume to point to ``/mavan/`` on the container to make the repository work after a container restart.
