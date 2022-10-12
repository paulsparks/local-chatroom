<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-6" id="startScreen">
                <div id="startText">
                    <div class="row">
                        <h2 class="openingText">Welcome!</h2>
                        <p class="subheading">LHS Live Chat is not responsible for any misuse of this application. Contact <a href="mailto:lhslivechat@gmail.com" style="color: aqua">lhslivechat@gmail.com</a> to report an incident. <span style="font-style:italic; color: #eeff80;">All messages are logged and may be reviewed at any point.</span></p>
                    </div>
                    <div class="row">
                        <div class="col-10 buttonWrapper">
                            <button @:click="generateName(); toggleVisibility('startText'); toggleVisibility('nameDisplay')" type="button" class="btn btn-primary jumpInBtn">Jump In</button>
                        </div>
                    </div>
                    <div class="row">
                        <p class="subheading" style="margin-top: 40px; font-size: 15px;">Not affiliated with Lebanon High School</p>
                    </div>
                </div>
                <div class="row hiddenElement" id="nameDisplay">
                    <div class="col-12" style="margin-left:auto;margin-right:auto;">
                        <p class="subheading" style="font-size: 20pt;">You will go by <span style="color: aqua;">{{ generatedName }}</span>.</p>
                        <div class="col-10 buttonWrapper">
                            <button @:click="confirmUsername(); removeItem('welcomeScreen'); toggleVisibility('mainPage')" type="button" class="btn btn-primary jumpInBtn">Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                nameList: [
                    'HappyMonkey',
                    'FluffyElephant',
                    'HoppingTurtle',
                    'BlushingCrow',
                    'FunnyBird',
                    'WaddlingPenguin',
                    'SleepyFish',
                    'ScaryDog',
                    'CuddlyKitten',
                    'MasterfulSquirrel',
                    'AngryShark',
                    'DerangedBeetle',
                    'PrancingOrangatan',
                    'GoofyBaboon',
                    'SpyingOwl',
                    'LurkingOstrich',
                    'CheerfulChimp',
                    'NefariousHog',
                    'SqueamishFerret',
                    'SheepishLamb',
                    'InkySquid'
                ],
                generatedName: ''
            }
        },
        methods: {
            confirmUsername() {
                this.$emit('confirmUsername', this.generatedName)
            },
            generateName() {
                let randomNum = Math.floor(Math.random() * (this.nameList.length))
                this.generatedName = this.nameList[randomNum]
            },
            removeItem(item) {
                let element = document.getElementById(item)
                element.remove()
            },
            toggleVisibility(item) {
                let element = document.getElementById(item)
                if (element.classList.contains('hiddenElement')) {
                    element.classList.remove('hiddenElement')
                    element.classList.add('unhiddenElement')
                } else {
                    element.classList.add('hiddenElement')
                    element.classList.remove('unhiddenElement')
                }
            }
        }
    }
</script>

<style scoped>
    #startScreen {
        margin-left: auto;
        margin-right: auto;
        padding: 10px;
    }

    .subheading {
        color: #b8dfff;
        font-size: 14pt;
    }

    .jumpInBtn {
        font-size: 20pt;
        width: auto;
    }

    .openingText {
        color: white;
        font-size: 30pt;
    }

    .buttonWrapper {
        margin-left: auto;
        margin-right: auto;
    }

    .hiddenElement {
        display: none;
    }

    .unhiddenElement {
        display: block;
    }

</style>