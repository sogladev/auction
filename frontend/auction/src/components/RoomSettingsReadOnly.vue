<template>
  <div class="q-px-sm col-lg-3 col-sm-6 col-xs-12">
    <div>name : {{ settings.name }}</div>
  </div>
  <div class="q-px-sm col-lg-3 col-sm-6 col-xs-12">
    <div> bidDurationInSeconds : {{ settings.bidDurationInSeconds }} </div>
  </div>
  <div class="q-px-sm col-lg-3 col-sm-6 col-xs-12">
    <div> countDownTimeInSeconds : {{ settings.countDownTimeInSeconds }} </div>
  </div>
  <div class="q-px-sm col-lg-3 col-sm-6 col-xs-12">
    <div> organiserFee : {{ settings.organiserFee }} </div>
  </div>
  <div class="q-px-sm col-lg-3 col-sm-6 col-xs-12">
    <div> minimumBid : {{ settings.minimumBidIncrement }} </div>
  </div>
  <div class="q-px-sm col-lg-3 col-sm-6 col-xs-12">
    <div> enableDiscordProtection : {{ settings.enableDiscordProtection }} </div>
  </div>
  <div class="q-px-sm col-lg-3 col-sm-6 col-xs-12">
    <div> restrictBidsToEquipable : {{ settings.restrictBidsToEquipable }} </div>
  </div>
  <div class="q-px-sm col-lg-3 col-sm-6 col-xs-12">
    <div> hideNameOfHighestBidder : {{ settings.hideNameOfHighestBidder }} </div>
  </div>
  <div class="q-px-sm col-lg-3 col-sm-6 col-xs-12">
    <div> hidePayoutDetails : {{ settings.hidePayoutDetails }} </div>
  </div>

</template>

<script lang="ts" setup>
import { RoomSettings } from './models';

defineProps<{
  settings: RoomSettings
}>()

</script>
