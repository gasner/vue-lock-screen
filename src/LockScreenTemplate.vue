<!-- https://codepen.io/frankno/pen/jpOxPY -->
<template>
    <!--	<div class="main-pattern-login fixed top-0 left-0 right-0 bottom-0 overflow-y-auto" style="z-index:101" :class="{ 'fade-out': success }" ref="touchArea">-->
    <main draggable="false">
        <svg id="pattern-login" ref="svg" viewBox="0 0 30 30" draggable="false" ondragstart="return false;" :class="successOrErrorClass">
            <defs>
                <defs>
                    <linearGradient id="MyGradient">
                        <stop offset="5%" stop-color="rgba(241, 231, 103, 1)"/>
                        <stop offset="95%" stop-color="rgba(254, 182, 69, 1)"/>
                    </linearGradient>
                </defs>
                <filter id="glow" width="1.5" height="1.5" x="-.25" y="-.25">
                    <feGaussianBlur stdDeviation="0.25" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <circle style="-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;user-select: none;-webkit-user-drag: none;user-drag: none;" draggable="false" ondragstart="return false;" v-for="(coord, i) in matrix" :key="i" ref="circle" :cx="coord[0]" :cy="coord[1]" r="3" :class="{ 'glow': (glowMatrix[i]) }" :data-key="i"></circle>
            <path style="-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;user-select: none;-webkit-user-drag: none;user-drag: none;" draggable="false" ondragstart="return false;" ref="indicator" id="indicator" :d="pathToSvg" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>


    </main>
    <!--	</div>-->
</template>

<script>
    export default {
        name: "lock-screen-template",
        props: {
            success: {default: null},
            freeze: {type: Boolean, default: false}
        },
        data() {
            return {
                matrix: [
                    //0:
                    [5, 5],
                    //1:
                    [15, 5],
                    //2:
                    [25, 5],
                    //3:
                    [5, 15],
                    //4:
                    [15, 15],
                    //5:
                    [25, 15],
                    //6:
                    [5, 25],
                    //7:
                    [15, 25],
                    //8:
                    [25, 25]
                ],
                path: [],
                trackMouseMove: false,
                screenX: 0,
                screenY: 0
            };
        },
        created() {
            this.$nextTick(function () {
                this.addEventListener();
            });
        },
        destroyed() {
            this.removeEventListener();
        },
        computed: {
            successOrErrorClass() {
                if (!this.trackMouseMove) {
                    if (this.isSuccess) {
                        return "success";
                    } else if (this.isFail) {
                        return "error";
                    }
                }
                return "";
            },
            isSuccess() {
                return this.success;
            },
            isFail() {
                //only if success is false to user fail but if is falsy the user not try;
                return this.success === false;
            },
            glowMatrix() {
                return this.matrix.map((n, i) => {
                    return this.path.includes(i);
                });
            },
            pathToSvg() {

                if (!this.path.length) return "";

                if (this.screenX && this.screenY && this.trackMouseMove)
                    var svgB = this.$refs.svg.getBoundingClientRect();

                return this.path.map((function (n, i) {
                    return (i ? " L " : "M ") + this.matrix[n][0] + " " + this.matrix[n][1];
                }).bind(this)).join("") + (this.screenX && this.screenY && this.trackMouseMove ? " L " + ((this.screenX - svgB.left) * 30 / svgB.width) + " " + ((this.screenY - svgB.top) * 30 / svgB.width) : "");
            }
        },
        methods: {
            addEventListener() {
                let template = this.$refs.svg;
                template.addEventListener("touchmove", this.mousemoveANDtouchmove);
                template.addEventListener("mousemove", this.mousemoveANDtouchmove);
                template.addEventListener("mouseup", this.touchendANDmouseup);
                template.addEventListener("touchend", this.touchendANDmouseup);
                template.addEventListener("mousedown", this.touchstartANDmousedown);
                template.addEventListener("touchstart", this.touchstartANDmousedown);
            },
            removeEventListener() {
                if (this.$refs && this.$refs.touchArea) {
                    let template = this.$refs.template;
                    template.removeEventListener("mousedown", this.touchstartANDmousedown);
                    template.removeEventListener("touchdown", this.touchstartANDmousedown);
                    template.removeEventListener("mouseup", this.touchendANDmouseup);
                    template.removeEventListener("touchend", this.touchendANDmouseup);
                    template.removeEventListener("touchmove", this.mousemoveANDtouchmove);
                    template.removeEventListener("mousemove", this.mousemoveANDtouchmove);
                }
            },
            touchstartANDmousedown(ev) {
                this.$emit("start");
                if (this.freeze) return false;
                this.trackMouseMove = true;
                this.path = [];
                // avoid scrolling when using touch

            },
            touchendANDmouseup(ev) {
                this.trackMouseMove = false;
                document.body.style.overflow = "auto";

                this.login();


            },
            mousemoveANDtouchmove(ev) {
                if (!this.trackMouseMove) return false;

                if (ev.type === "mousemove") {

                    var target = document.elementFromPoint(ev.clientX, ev.clientY);
                    this.screenX = ev.clientX;
                    this.screenY = ev.clientY;
                } else {
                    var myLocation = ev.changedTouches[0];
                    var target = document.elementFromPoint(myLocation.clientX, myLocation.clientY);
                    this.screenX = myLocation.clientX;
                    this.screenY = myLocation.clientY;
                }
                if (!target) {
                    console.log("fdsfdsf");
                    return false;
                }
                let keyAsString = target.getAttribute("data-key");
                let key = undefined;

                if (keyAsString) key = Number(keyAsString);
                else return false;

                /*
                   This part of the code is a little bit nasty.
                   For performance reasons, when moving the finger or mouse fast enough,
                   there was a chance that one would "skip" one of the touchable dots.
                   So this code looks for the currently touched dot and the previus one
                   and fill in the blank with the dot that may have left inbetween
                */
                document.body.style.overflow = "hidden";
                let last_key = this.path[this.path.length - 1];

                if (last_key == 0 && key == 2)
                    this.path.push(1);
                if (last_key == 0 && key == 6)
                    this.path.push(3);
                if (last_key == 0 && key == 8)
                    this.path.push(4);

                if (last_key == 1 && key == 7)
                    this.path.push(4);

                if (last_key == 2 && key == 1)
                    this.path.push(1);
                if (last_key == 2 && key == 6)
                    this.path.push(4);
                if (last_key == 2 && key == 8)
                    this.path.push(5);

                if (last_key == 3 && key == 5)
                    this.path.push(4);

                //4

                if (last_key == 5 && key == 3)
                    this.path.push(4);


                if (last_key == 6 && key == 0)
                    this.path.push(3);
                if (last_key == 6 && key == 8)
                    this.path.push(7);
                if (last_key == 6 && key == 4)
                    this.path.push(4);

                if (last_key == 7 && key == 1)
                    this.path.push(4);

                if (last_key == 8 && key == 0)
                    this.path.push(4);
                if (last_key == 8 && key == 2)
                    this.path.push(5);
                if (last_key == 8 && key == 6)
                    this.path.push(7);

                if (!this.path.includes(key))
                    this.path.push(key);

            },
            login() {

                //	if (this.freeze) return false;
                if (!this.path.length)
                    return false;
                this.$emit("finish", this.path);


            }
        },

    };
</script>

<style scoped>
    /*Atomic CSS components (tachyons inspired)*/

    @keyframes fade-out {
        to {
            opacity: 0;
        }
    }

    main {
        box-sizing: border-box;
        text-align: center;
        user-select: none;
    }

    svg#pattern-login {
        cursor: pointer;
        width: 400px;
        height: 400px;
        max-width: 80vmin;
        max-height: 80vmin;
        fill: transparent;
        stroke: #777;
        stroke-width: 0.3px;
        display: inline-block;
    }

    svg#pattern-login circle.glow {
        stroke: #37F;
    }

    svg#pattern-login path#indicator {
        stroke: #4D4D4D;
    }

    .glow {
        filter: url(#glow);
    }

    svg#pattern-login.success circle.glow {
        stroke: #3F7;
    }

    svg#pattern-login.success path#indicator {
        stroke: #3F7;
    }

    svg#pattern-login.error circle.glow, svg#pattern-login.error path#indicator {
        stroke: #F33;
    }
</style>
