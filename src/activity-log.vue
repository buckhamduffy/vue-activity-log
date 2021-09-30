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
					<li
							v-for="activity_log in activityLogs.data"
							:key="activity_log.id"
							class="list-group-item">
						<div class="d-flex justify-content-between">
							<div>
								<strong>{{ causerName(activity_log) }}</strong>
							</div>
							<div>
								{{ dayjs(activity_log.created_at).format('D MMMM YYYY, hh:mma') }}
							</div>
						</div>
						<template v-if="activity_log.properties && activity_log.properties.attributes">
							{{ activity_log.description }}:
							<ul>
								<li
										v-for="key in Object.keys(activity_log.properties.attributes)"
										:key="key">
									<strong>{{ key | humanize }}</strong>
									<template>
										from
										<strong>
											{{ activity_log.properties.old[key] | humanize }}
										</strong>
									</template>
									<template>
										to
										<strong>
											{{ activity_log.properties.attributes[key] | humanize }}
										</strong>
									</template>
								</li>
							</ul>
						</template>
						<template v-else>
							{{ activity_log.description }}
						</template>
						<div class="clearfix mt-2"></div>
					</li>
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
import dayjs from 'dayjs'

export default {
	filters: {
		humanize(value) {
			if (value === 0) {
				return value;
			}

			if (value === null) {
				return 'blank';
			}

			if (!value) return ''
			value = value.toString();
			let isFloat = Number(value) === value && value % 1 !== 0;
			if (Number.isInteger(value) || isFloat) {
				return value;
			}
			if (/^\[.+\]$/.test(value)) {
				return JSON.parse(value).join(', ')
			}
			if (/^\d{4}-\d{2}-\d{2}$/.test(value) || /^\d{4}-\d{2}-\d{2} 00:00:00$/.test(value) || /^\d{4}-\d{2}-\d{2}T00:00:00\.000000Z$/.test(value)) {
				return moment(value).format('DD/MM/YYYY')
			}
			if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
				return moment(value).format('DD/MM/YYYY HH:mm A')
			}
			return value.replace(/^[\s_]+|[\s_]+$/g, '')
					.replace(/[_\s.]+/g, ' ')
					.replace(/[\]']+/g, '')
					.replace(/['"]+/g, '')
		}
	},
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
		causerName(activity_log) {
			if (!activity_log.causer) return 'System';
			return activity_log.causer.first_name + ' ' + activity_log.causer.last_name;
		},
		fetchActivityLogs(page) {
			this.$emit('fetch', page);
		},
		dayjs(data) {
			return dayjs(data);
		}
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
