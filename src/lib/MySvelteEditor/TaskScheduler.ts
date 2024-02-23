export class TaskScheduler {
	private timeoutId: number | undefined = undefined;
	private readonly delay: number; // Delay in milliseconds
	private readonly task: () => void;

	constructor(task: () => void, delay: number) {
		this.task = task;
		this.delay = delay;
	}

	// Method to schedule or reschedule the task
	scheduleTask() {
		if (this.timeoutId !== null) {
			clearTimeout(this.timeoutId);
		}
		this.timeoutId = setTimeout(() => {
			this.task();
			this.timeoutId = undefined;
		}, this.delay);
	}

	// Example method to delay task on an event
	onEvent() {
		console.log('Event occurred, delaying task...');
		this.scheduleTask();
	}
}
