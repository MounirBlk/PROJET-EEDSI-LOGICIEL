import Vue from 'vue'
import VueKinesis from 'vue-kinesis'
import { KinesisContainer, KinesisElement, KinesisAudio, KinesisDistance  } from 'vue-kinesis'

Vue.use(VueKinesis)

Vue.component('kinesis-container', KinesisContainer)
Vue.component('kinesis-element', KinesisElement)
Vue.component('kinesis-audio', KinesisAudio)
Vue.component('kinesis-distance', KinesisDistance)