/**
 * @class override.app.EventDomain
 * @override Ext.app.EventDomain
 * Override for MVC Controllers to support suspendEvents.
 */
Ext.define('overrides.app.EventDomain', {
	override: 'Ext.app.EventDomain',
	/**
	 * @inheritdoc
	 */
	constructor: function()
	{
		this.callParent(arguments);
		this.eventQueue = {};
	},
	/**
	 * @inheritdoc
	 */
	monitor: function(observable)
	{
		this.callParent(arguments);
		this.applyPrototypeMembers(observable);
	},
	/**
	 * Override prorotype functions
	 * @param {Ext.util.Observable/Ext.Class} observable
	 * @private
	 */
	applyPrototypeMembers: function(observable)
	{
		var domain = this,
			prototype = observable.isInstance ? observable : observable.prototype,
			resumeEvents = prototype.resumeEvents;

		prototype.resumeEvents = function(ev, args) {
			var ret = resumeEvents.apply(this, arguments);

			domain.resumeQueuedEvents(this);

			return ret;
		};
	},
	/**
	 * @inheritdoc
	 */
	dispatch: function(target, ev, args)
	{
		// don't dispatch if suspended
		if (target.eventsSuspended)
		{
			// Queue them when queued via target.suspendEvents(true)
			if (!!target.eventQueue)
			{
				target.domainEventQueue = target.domainEventQueue || [];
				target.domainEventQueue.push([target, ev, args]);
			}
			return true;
		}
		return this.callParent(arguments);
	},
	/**
	 * Called every resumeEvents on an Observable.
	 * Fire queued events if available.
	 * @private
	 */
	resumeQueuedEvents: function(target)
	{
		var me = this,
			queue = target.domainEventQueue,
			i = 0,
			len;
		if (queue)
			for (len = queue.length; i < len; i++)
				me.dispatch.apply(me, queue[i]);
		delete target.domainEventQueue;
	}
}, function() {
	var type,
		inst = Ext.app.EventDomain.instances,
		i,
		len;
	for (type in inst)
		if (inst.hasOwnProperty(type))
		{
			inst[type].eventQueue = {};
			for (i = 0, len = inst[type].monitoredClasses.length; i < len; i++)
				inst[type].applyPrototypeMembers(inst[type].monitoredClasses[i]);
		}
});