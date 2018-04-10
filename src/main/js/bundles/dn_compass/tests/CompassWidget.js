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
import registerSuite from "intern!object";
import assert from "intern/chai!assert";
import CompassWidget from "../CompassWidget";
import CompassModel from "../CompassModel";
import uitest from "uitest-support/uitest";
import Button from "dijit/form/Button";


import TestVue from "../CompassVue.vue";
import Vue from "apprt-vue/Vue";
import Vuetify from "vuetify";
import VueDijit from "apprt-vue/VueDijit";

import Binding from "apprt-binding/Binding";

let uit = uitest();


/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

registerSuite({
    name: module.id,
    "expect Compass can be created"() {

        let model = new CompassModel();

        Vue.use(Vuetify);

        let widget = VueDijit(new Vue(TestVue));

        Binding.for(model, widget)
            .syncToRight("heading")
            .enable();

        let button = new Button({
            label: "random",
            onClick: () =>{
                model.set("heading", getRandomInt(0, 360));
            }
        });
        return uit.getAttachNode().then(function(node) {
            widget.placeAt(node).startup();
            button.placeAt(node).startup();
        });
    }
});