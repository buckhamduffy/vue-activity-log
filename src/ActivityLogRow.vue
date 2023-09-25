<template>
	<li class="list-group-item">
		<div class="d-flex justify-content-between">
			<div>
				<strong>{{ causerName(activityLog) }}</strong>
			</div>
			<div v-if="isDiff">
				<a href="#" @click.prevent="toggleDiff">
					{{ showDiff ? 'Hide Diff' : 'Show Diff' }}
				</a>
			</div>
			<div>
				{{ dayjs(activityLog.created_at).format('D MMMM YYYY, hh:mma') }}
			</div>
		</div>
		<template v-if="isDiff">
			{{ activityLog.description }}:
			<ul>
				<li v-for="key in Object.keys(activityLog.properties.attributes)"
					:key="key">

					<strong>{{ humanize(key) }}</strong>
					<template v-if="!isObject(activityLog.properties.attributes[key])">
						<span v-if="activityLog.properties.old[key]">
						from
						<strong>
							{{ humanize(activityLog.properties.old[key]) }}
						</strong>
					</span>
						<span v-if="activityLog.properties.attributes[key]">
						to
						<strong>
							{{ humanize(activityLog.properties.attributes[key]) }}
						</strong>
					</span>
					</template>
					<template v-else>
						<a href="#" @click.prevent="toggleDiff">
							{{ showDiff ? 'Hide' : 'View' }}
						</a>
					</template>
				</li>
			</ul>
			<div v-show="showDiff">
				<div class="row">
					<div class="col">
						<vue-json-pretty :data="activityLog.properties.old"></vue-json-pretty>
					</div>
					<div class="col">
						<vue-json-pretty :data="activityLog.properties.attributes"></vue-json-pretty>
					</div>
				</div>
			</div>
		</template>
		<template v-else>
			{{ activityLog.description }}
		</template>
		<div class="clearfix mt-2"></div>
	</li>
</template>

<script>
	import {isArray, isBoolean, isNumber, isObject} from 'lodash';
	import dayjs from 'dayjs'
	import VueJsonPretty from 'vue-json-pretty';
	import 'vue-json-pretty/lib/styles.css';
	export default {
		name: 'ActivityLogRow',
		components: {
			VueJsonPretty,
		},
		props: {
			activityLog: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				showDiff: false
			}
		},
		computed: {
			isDiff() {
				return this.activityLog.properties && this.activityLog.properties.attributes;
			}
		},
		methods: {
			causerName(activityLog) {
				if (!activityLog.causer) return 'System';

				let content = activityLog.causer.first_name + ' ' + activityLog.causer.last_name;

				if (activityLog.causer.role) {
					return content + ` (${activityLog.causer.role})`
				}

				return content
			},

			dayjs(data) {
				return dayjs(data);
			},
			humanize(value) {
				if (!value) return 'N/A'

				if (isBoolean(value)) {
					return value ? 'Yes' : 'No'
				}

				if (isNumber(value)) {
					return value;
				}

				if (isObject(value)) {
					return JSON.stringify(value)
				}

				if (isArray(value)) {
					return value.join(', ')
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
			},
			toggleDiff() {
				this.showDiff = !this.showDiff
			},
			isObject(val) {
				return isObject(val)
			}
		}
	}
</script>

<style scoped>

</style>
