<template>
    <div class="text-xs-center">

        <v-btn v-if="isNotCordova" raised class="primary" @click.native="getRandomHeading">Random</v-btn>
        <div class="compass">
            <div class="background" v-bind:style="{ transform: transform }">
                <div class="dial">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>

                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>

                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>

                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <div class="letter north">N</div>
                <div class="marker north"></div>
                <div class="letter south">S</div>
                <div class="marker south"></div>
                <div class="letter east">E</div>
                <div class="marker east"></div>
                <div class="letter west">W</div>
                <div class="marker west"></div>
            </div>
            <div class="pointer">
                <div class="content-north"/>
                <div class="content-middle">
                    <div class="heading">
                        <div class="heading-textual">{{ headingTextual }}</div>
                        <div class="heading-numeric">{{ heading }}°</div>
                    </div>
                </div>
                <div class="content-south"/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            getRandomHeading: function () {
                this.heading = Math.floor(Math.random() * (360 - 0 + 1)) + 0;
            },
            calcTextualHeading: function (val) {
                if ((val >= 0 && val <= 22.5) || (val > 337.5 && val <= 360)) {
                    this.headingTextual = 'N';
                    return;
                }
                if (val > 22.5 && val <= 67.5) {
                    this.headingTextual = 'NE';
                    return;
                }
                if (val > 67.5 && val <= 112.5) {
                    this.headingTextual = 'E';
                    return;
                }
                if (val > 112.5 && val <= 157.5) {
                    this.headingTextual = 'SE';
                    return;
                }
                if (val > 157.5 && val <= 202.5) {
                    this.headingTextual = 'S';
                    return;
                }
                if (val > 202.5 && val <= 247.5) {
                    this.headingTextual = 'SW';
                    return;
                }
                if (val > 247.5 && val <= 292.5) {
                    this.headingTextual = 'W';
                    return;
                }
                if (val > 292.5 && val <= 337.5) {
                    this.headingTextual = 'NW';
                }
            }
        },
        watch: {
            heading: function (val) {
                this.transform = `rotate(${360 - val}deg)`;
                this.calcTextualHeading(val)
            }
        },
        data() {
            return {
                isNotCordova: true,
                heading: 0,
                headingTextual: 'N',
                transform: 'rotate(0deg)'
            }
        }
    }
</script>
