/*
 * Copyright (C) 2018 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import declare from "dojo/_base/declare";

import Binding from "apprt-binding/Binding";

import PoiFinderVue from "./PoiFinderVue.vue";
import PoiModel from "./PoiModel";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";

import QueryTask from "esri/tasks/QueryTask";
import Query from "esri/tasks/support/Query";

const POI_BINDING = Symbol("poi_binding");
const company_url = "https://services.conterra.de/arcgis/rest/services/common/standorte/FeatureServer/0";

const PoiFinderFactory = declare([], {

    createInstance: function () {
        return this._poiFinder;
    },
    activate: function () {
        let model = this.model = new PoiModel();

        const positionCallback = (position) => {
            console.log(`Callback: ${position}`);
            this.model.set("currentPosition", position);
        };

        const headingCallback = (heading) => {
            console.log(`Callback: ${heading}`);
            this.model.set("heading", Math.round(heading));
        };

        this.orientationService.watchHeading(headingCallback);
        this.geolocationService.watchPosition(positionCallback);

        this._poiFinder = VueDijit(new Vue(PoiFinderVue));
        this._bindModel(model, this._poiFinder);

        this._queryCompanyStore();
    },
    _queryCompanyStore: function () {
         // STORE ?!
        let queryTask = new QueryTask({
            url: company_url
        });
        let query = new Query();
        query.returnGeometry = true;
        query.outFields = ["*"];
        query.where = "1=1";
        query.outSpatialReference = { wkid: 4326 };

        queryTask.execute(query).then((results) =>{
            results.features.forEach( (feature) => {
                this.model.items.push({
                    name: feature.attributes.name4,
                    lat: feature.geometry.latitude,
                    lon: feature.geometry.longitude
                })
            })
        });
    },
    _bindModel: function(model, widget) {
        let b = Binding.create()
            .syncToRight("items")
            .sync("selected")
            .sync("currentPosition")
            .syncToRight("heading")
            .enable();
        b.bindTo(model, widget).syncToRightNow();
        this._poiFinder[POI_BINDING] = b;
    },

    _cleanup: function () {
        this.model = undefined;
        this.orientationService.stopWatching();
        this.geolocationService.stopWatching();

        let b = this._poiFinder[POI_BINDING];
        b.unbind();
        delete this._poiFinder[POI_BINDING];

    },
    deactivate: function () {
        this._cleanup();
    },
    destroyInstance : function(instance){
        this._cleanup();
        instance.destroyRecursive();
    }
});

module.exports = PoiFinderFactory;