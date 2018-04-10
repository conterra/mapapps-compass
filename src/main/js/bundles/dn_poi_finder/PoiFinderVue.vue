<template>
    <div>
        <v-select
                v-bind:items="items"
                v-model="selected"
                label="Companies"
                item-text="name"
                single-line
        ></v-select>

        <v-card v-if="currentPosition.coords !== undefined">
            <v-card-title>
                <div>
                    <h5 class="mb-0">Position</h5>
                    <div>Latitude: {{ currentPosition.coords && Math.round(currentPosition.coords.latitude * 1000) / 1000 || 0}}°</div>
                    <div>Longitude: {{ currentPosition.coords && Math.round(currentPosition.coords.longitude * 1000) / 1000 || 0}}°</div>
                    <div>Heading: {{ heading }}°</div>
                </div>
            </v-card-title>
        </v-card>
        <v-card v-else>
            <v-card-title>
                <div>
                    <h5 class="mb-0">No Position available</h5>
                </div>
            </v-card-title>
        </v-card>

        <v-divider class="my-2"></v-divider>

        <v-card v-if="selected">
            <v-card-title>
                <div>
                    <h5 class="mb-0">{{ selected.name }}</h5>
                    <div>Latitude: {{ Math.round(selected.lat * 1000) / 1000 }}°</div>
                    <div>Longitude: {{ Math.round(selected.lon * 1000) / 1000 }}°</div>
                </div>
            </v-card-title>
        </v-card>

        <v-divider class="my-2"></v-divider>

        <v-card v-if="selected && currentPosition !== {}">
            <v-card-title>
                <div>
                    <h5 class="mb-0">Distance: {{ Math.round(distance * 1000) / 1000 }} km - Bearing: {{ bearing
                        }}°</h5>
                </div>
            </v-card-title>
        </v-card>
        <div class="finder-wrapper">
            <div class="finder" v-if="selected && currentPosition !== {}" v-bind:style="{ transform: transform }">
                <div class="pointer">
                    <div class="content-north"/>
                    <div class="content-middle">
                        <div class="heading"/>
                    </div>
                    <div class="content-south"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Polyline from "esri/geometry/Polyline";
    import geometryEngine from "esri/geometry/geometryEngine";
    export default {
        data() {
            return {
                selected: null,
                items: [],
                currentPosition: {

                },
                distance: "",
                heading: 0,
                bearing: 0,
                transform: 'rotate(0deg)'
            }
        },
        watch: {
            selected: function (newSelected) {
                this.distance = this.calculateDistance();
                this.bearing = this.calculateBearing();
            },
            currentPosition: function (newPosition) {
                this.distance = this.calculateDistance();
                this.bearing = this.calculateBearing();
            },
            bearing: function (val) {
                this.transform = `rotate(${val - this.heading}deg)`;
            },
            heading: function (val) {
                this.transform = `rotate(${this.bearing - val}deg)`;
            }

        },
        methods: {
            calculateDistance: function () {
                if (!(this.selected && this.currentPosition !== {} && this.currentPosition.coords !== undefined)) {
                    return "";
                }
                let paths = [[this.selected.lon, this.selected.lat], [this.currentPosition.coords.longitude, this.currentPosition.coords.latitude]];
                let line = new Polyline({
                    hasZ: false,
                    hasM: false,
                    paths: paths,
                    spatialReference: {wkid: 4326}
                });
                return geometryEngine.geodesicLength(line, "kilometers");
            },
            calculateBearing: function () {
                if (!(this.selected && this.currentPosition !== {} && this.currentPosition.coords !== undefined)) {
                    return 0;
                }
                let dLon = (this.selected.lon - this.currentPosition.coords.longitude) * Math.PI / 180;
                let lat1 = this.currentPosition.coords.latitude * Math.PI / 180;
                let lat2 = this.selected.lat * Math.PI / 180;
                let y = Math.sin(dLon) * Math.cos(lat2);
                let x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
                let bearing = Math.atan2(y, x) * 180 / Math.PI;
                return Math.round((bearing + 360) % 360);

                /* debugger;
                 if (bearing >= 0 && bearing < 90) {
                 return bearing;
                 }
                 if (bearing >= 90 && bearing < 180) {
                 return 180 - bearing;
                 }
                 if (bearing >= 180 && bearing < 270) {
                 return bearing - 180;
                 }
                 if (bearing >= 270) {
                 return 360 - bearing;
                 }
                 return 0;*/
            }

        }
    }
</script>
