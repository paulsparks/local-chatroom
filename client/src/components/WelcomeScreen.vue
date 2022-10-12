<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-6" id="startScreen">
                <div id="startText">
                    <div class="row">
                        <h2 class="openingText">Welcome!</h2>
                    </div>
                    <div class="row">
                        <div class="col-8 buttonWrapper">
                            <button @:click="generateName(); toggleVisibility('startText'); toggleVisibility('nameDisplay')" type="button" class="btn btn-primary">Jump In</button>
                        </div>
                    </div>
                </div>
                <div class="row hiddenElement" id="nameDisplay">
                    <div class="col-8" style="margin-left:auto;margin-right:auto;">
                        <p style="color:white;">You will go by {{ generatedName }}.</p>
                        <div class="col-8" style="margin-left:auto;margin-right:auto;">
                            <button @:click="removeItem('welcomeScreen'); toggleVisibility('mainPage')" type="button" class="btn btn-primary">Continue</button>
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
        background-color: #5b717d;
        margin-left: auto;
        margin-right: auto;
        padding: 10px;
    }

    h2 {
        font-weight: bold;
    }

    .buttonWrapper {
        margin-left: auto;
        margin-right: auto;
    }

    .btn {
        color: black;
    }

    .btn:hover {
        color: black;
    }

    .btn:active:focus {
        color: black;
    }

    .hiddenElement {
        display: none;
    }

    .unhiddenElement {
        display: block;
    }

</style>