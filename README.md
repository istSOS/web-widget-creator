<h1>IstSOS Web Widget Creator</h1>
<h3><strong><i>Introduction</i></strong></h3>
<p>
IstSOS Web Widget Creator is a Web application that introduces tools for generating feature-rich widgets based on sensor observation data from IstSOS. It was developed using ES6 syntax, Babel transpiler and Webpack and It relies on IstSOS JavaScript core library. Tools that are offered to end-users/developers:
<ul>
	<li>Map tool</li>
	<li>Box tool</li>
	<li>Chart tool - <span style="color:darkred">(currently unabailable!!!)</span></li>
</ul>
</p>
<h3><strong><i>Requirements</i></strong></h3>
<p>
In order for IstSOS Web Widget Creator to work as expected, there are couple of requirements needed to be taken care of before installation:
<ul>
	<li>Server configuration JSON needs to be populated. There is already a template file inside the <code>./spec</code> folder.
	</li>
	<li>Observed property configuration JSON needs to be populated. There is already a template file inside the <code>./spec</code> folder.</li>
	<li><a href="http://istsos.org/">IstSOS</a> needs to be installed</span></li>
</ul>
</p>
<h3><strong><i>Installation</i></strong></h3>
Installation steps:
<ol>
	<li>Clone the repository:<br/><br/>
		<code>git clone https://github.com/istSOS/web-widget-creator.git</code>
	</li>
	<li>Install dependencies:<br/><br/>
		<code>npm install</code>
	</li>
	<li>Put the application on your server</li>
</ol>
<ul>
	<i>For developers:</i>
	<li>Start development environment(for developers):<br/><br/>
		<code>npm start</code>
		<p><i>Navigate to http://localhost:9001/</i></p>
	</li>
	<li>Run application build(for developers):<br/><br/>
		<code>npm run build</code>
	</li>
</ul>
<h3><strong><i>Usage instructions</i></strong></h3>
Usage steps:
<ol>
	<li>Select one of the tools</li>
	<li>Populate the form on the left side and click GENERATE button</li>
	<li>On the right side, there will be an output preview and output embeddable code</li>
	<li>Copy the code and paste it into your web page</li>
</ol>
<h3><strong><i>Demo</i></strong></h3>
<a target="_blank" href="http://luka-g.github.io/web-widget-creator">Live demo</a>