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
function DeviceOrientationService() {
    return {
        getCurrentHeading: () => {
            const headingCallback = (heading) => {
                console.log(heading.magneticHeading);
                return heading.magneticHeading;
            };
            return navigator.compass && navigator.compass.getCurrentHeading(headingCallback, () => console.error("Compass Error: Can't get current Heading")) || 0;
        },
        watchHeading: (callback) => {
            let watch = navigator.compass && navigator.compass.watchHeading(
                (heading) => {
                    callback(heading.magneticHeading);
                    console.log(heading.magneticHeading);
                },
                (err) => {
                    console.error("Compass Error: Can't get current Heading: "+ err);
                    if (err.code === 20) { // CompassError.COMPASS_NOT_SUPPORTED
                        navigator.compass && navigator.compass.clearWatch(watch);
                    }
                }, {frequency: 100});
            this._handle = watch;
        },
        stopWatching: () => {
            let handle = this._handle;
            navigator.compass && handle && navigator.compass.clearWatch(handle);
            this._handle = undefined;
        }
    }
}

module.exports = DeviceOrientationService;