<template>
	<b-overlay :show="loading">
		<div class="row">
			<div class="col-12">
				<b-alert :show="activityLogs.data.length === 0"
						 variant="warning"
						 class="m-3">
					No Activity Logs to display
				</b-alert>
				<ul class="list-group">
					<activity-log-row v-for="activity_log in activityLogs.data"
									  :key="activity_log.id" :activity-log="activity_log"></activity-log-row>
				</ul>
			</div>
			<div v-show="activityLogs.meta.last_page > 1" class="col-12">
				<b-pagination
					:value="activityLogs.meta.current_page"
					:total-rows="activityLogs.meta.total"
					:per-page="activityLogs.meta.per_page"
					@change="fetchActivityLogs">
				</b-pagination>
			</div>
		</div>
	</b-overlay>
</template>

<script>
	import ActivityLogRow from './ActivityLogRow'

	export default {
		components: {ActivityLogRow},
		props: {
			activityLogs: {
				type: Object,
				required: true,
				validation: (value) => {
					if (typeof value !== 'object') {
						return false;
					}
					return 'data' in value && 'meta' in value;
				}
			},
			loading: {
				type: Boolean,
				required: false,
				default: false
			}
		},
		methods: {
			fetchActivityLogs(page) {
				this.$emit('fetch', page);
			},
		}
	}
</script>

<style scoped>
.list-group-item {
	border: none;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	background: #f6f8fa;
	margin-bottom: 1rem;
}

.list-group-item:hover {
	background: #f6f8fa !important;
}

.list-group-item:last-child {
	margin-bottom: none;
}
</style>
