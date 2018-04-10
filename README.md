# Compass Bundle
The Compass Bundle is an example on how to use native device APIs provided by Apache Cordova inside map.apps .

Sample App
------------------
https://demos.conterra.de/mapapps/resources/apps/compass/index.html

![Screenshot Sample App Compass Slider](https://github.com/conterra/mapapps-compass/blob/master/screenshot.PNG)

Installation Guide
------------------
**Requirement: map.apps 4.3.0**

Simply add the bundles "dn_compass", "dn_poi_finder" and "dn_device_service"," to your map.apps 4 app.

Development Guide
------------------
### Pre Conditions
This project requires an existing installation of map.apps to work. You need top copy the libs provided in the CD-Contents folder "m2repository" inside your local maven repository.

### App Template
It is recommended to use the provided app template for app exports from map.apps in production . This includes e.g. the "map-preload-2D" bundle to ensure all resources are present in the exported app.

Development Guide
------------------
### Define the mapapps remote base
Before you can run the project you have to define the mapapps.remote.base property in the pom.xml-file:
`<mapapps.remote.base>http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%</mapapps.remote.base>`

##### Other methods to to define the mapapps.remote.base property.
1. Goal parameters
`mvn install -Dmapapps.remote.base=http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%`

2. Build properties
Change the mapapps.remote.base in the build.properties file and run:
`mvn install -Denv=dev -Dlocal.configfile=%ABSOLUTEPATHTOPROJECTROOT%/build.properties`