<cfscript>
// This should be true for dev and false for production environments
server.beanFactoryLazyLoad = true;
// This should be true for dev and false for production environments
server.reloadApplicationOnEveryRequest = true;
// This should not be set to true on production; can be set to true on dev to debug
server.logsql = true;
// Set this to whatever path has the default ehcache configuration file for the server
server.defaultEhCacheConfigPath = "C:/ColdFusion10/cfusion/lib/ehcache.xml";
// Set this for pages that don't require the user to be logged in to view
server.publicPages = "login.cfm";
</cfscript>