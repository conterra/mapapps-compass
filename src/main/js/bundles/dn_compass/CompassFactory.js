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
import CompassModel from "./CompassModel";
import declare from "dojo/_base/declare";

import Binding from "apprt-binding/Binding";

import CompassVue from "./CompassVue.vue";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";

const COMPASS_LAYER_BINDING = Symbol("compass_binding");

const CompassFactory = declare([], {

    createInstance: function () {
        return this._compass;
    },
    activate: function () {
        let model = this.model = new CompassModel();

        if(window.cordova){
            model.set("isNotCordova", false);
        }

        const callback = (heading) => {
            console.log(`Callback: ${heading}`);
            this.model.set("heading", Math.round(heading));
        };

        this.orientationService.watchHeading(callback);

        this._compass = VueDijit(new Vue(CompassVue));
        this._bindModel(model, this._compass);
    },

    _bindModel: function(model, widget) {
        let b = Binding.create()
            .syncToRight("heading")
            .syncToRight("isNotCordova")
            .enable();
        b.bindTo(model, widget).syncToRightNow();
        this._compass[COMPASS_LAYER_BINDING] = b;
    },

    _cleanup: function () {
        this.model = undefined;
        this.orientationService.stopWatching();

        let b = this._compass[COMPASS_LAYER_BINDING];
        b.unbind();
        delete this._compass[COMPASS_LAYER_BINDING];

    },
    deactivate: function () {
        this._cleanup();
    },
    destroyInstance : function(instance){
        this._cleanup();
        instance.destroyRecursive();
    }
});

module.exports = CompassFactory;
