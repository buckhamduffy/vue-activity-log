<script>
import Vue from 'vue';
import ActivityLog from '@/activity-log.vue';

export default Vue.extend({
	name: 'ServeDev',
	data() {
		return {
			logs: {
				data: [
					{
						id: 1,
						causer: {
							first_name: 'Alex',
							last_name: 'Duffy'
						},
						description: 'Test Description'
					},
					{
						id: 1,
						causer: {
							first_name: 'Alex',
							last_name: 'Duffy'
						},
						description: 'Test Description'
					}
				],
				meta: {}
			}
		}
	},
	components: {
		ActivityLog
	}
});
</script>

<template>
	<div id="app">
		<b-container class="mt-5">
			<activity-log :activity-logs="logs"/>
		</b-container>
	</div>
</template>
