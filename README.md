# istSOS - Web Widget Creator
An Online Web Application for building feature­rich web widget that will be easily embeddable into existing web pages.

---

### Usage instructions:

#### <i>Important</i>:
<i>Chart creator tool depends on another framework called <b>VistSOS - Data visualization framework</b>, which can be downloaded or cloned [here](https://github.com/felipe07/VistSOS-1).
Just clone <b>istsos Web widget creator</b> and <b>VistSOS</b> and put them as folders, next to each other</i>, inside your Apache public folder(e.g. ```./var/www/...```). Inside <b>VistSOS</b>, you should find ```./src/util/util.js``` and change the ```specPath``` from default to ```../VistSOS-1/src/specs/```. Also, you should find ```.src/default-widget.html``` and <b>remove</b> istsos-core library script tag from it:
```HTML 
<!-- REMOVE/COMMENT OUT THIS TAG -->
<script src=".../istsos-core-.*.js"></script>
```

#### Configuration:

Before, you can use <b>istsos Web widget creator</b>, next couple of things need to be configured:

1. <b>istSOS Web application</b> - istsos Web widget creator is a "helper" application for [istSOS](http://istsos.org/), so you should set up istSOS at your local machine.
2. <b>Server configuration</b> - there is a ```./specs/server_config.json``` file, which needs to be populated with your local server data.
3. <b>Observed properties specifications</b> - there are two files:
	+ ```./specs/observed_property_names.json``` - this file is used for mapping observed properties default names to user-defined names. Box widget uses this configuration for displaying user-defined names, instead of default ones.
	+ ```./specs/observed_property_spec.json``` - this file is used for specifying interval values and icon url for every observed property definition. This is important, because based on observation value, different icon is shown. Box and Map widgets use this configuration file.
4. <b>Chart types specification</b> - Whenever <b>VistSOS</b> framework is updated with the new charts and attributes, this file needs to be updated too, because <b>istsos Web widget creator</b> uses this to generate chart specific input form

#### istsos Web widget creator usage steps:

Open ```./index.html```:

1. Select one of the desired creator tools from the menu:
	+ <b>Map</b>
	+ <b>Chart</b>
	+ <b>Box</b>

2. On the left side, a coresponding creator inputs form will show, which contains:
	+ <b>Server dependent data for selection</b> - services > offerings > procedures > observed properties
	+ <b>Common widget settings fields</b> - target HTML element ID, target element CSS class, widget height and widget width
	+ <b>Widget dependent input form</b> - charts > type (with type attribute fields), box > layout (horizontal or vertical)
	+ <b>Automatic update setup(optional)</b> - user is offered to setup regular data update interval and startup update delay
	+ <b>Generate widget button</b> - creates a widget preview and generates embedded code

3. In the middle section, there are two output windows:
	+ <b>Preview</b> - upper section, where the generated widget is shown
	+ <b>Code</b> - lower section, where generated embedded code is shown


<b>Note</b>: <i>Import generated embedded code into your Web site/page to display it.</i>