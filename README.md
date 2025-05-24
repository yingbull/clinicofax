This effort was just started and the repository is under development!  Welcome!
Right now there are some infrastructure/architecture approaches I wish to look at, and validate the automated security/dependency alerts of various severities I am seeing.  As such I am setting the code branch to "experimental" to properly convey the current state of this forked development. - michael yingbull

Introduction
============
Clinico fax is a developmental effort forked from ICTFAX focused around delivering fax-related services and T.38 gateway/G.711 pass through for use in environments such as medical clinics.  This is built upon  open source __Freeswitch__, __[ICTCore]__ communications frameowrk and Php based Angular framework. It support both inbound and outbound faxing. 

It can be used in following faxing scenarios

* [Email to fax][emailtofax] / [web to fax][webtofax] / [fax to email][emailtofax]
* ATA support supporting both sending and recieving Fax over Fax machines using ATA. 
* G.711 based Fax Origination / Termination / Gateway
* T.38 based Fax Origination / Termination
* PSTN/SS7 based Fax Origination / Termination

A Single GUI is created to cover all the major communication methods and services like:

- Send Document with multiple files (optional)
- Fax to Email
- Extension Support
- DIDs

### Features

By Using ICTFax a user can manage:

  * Outbound Fax
  * Inbound Fax
  * Fax DIDs
  * Fax Extensions
  * Contacts Management
  * Fax Documents
  * User Management
  * Provider / Trunks

This effort will focus on features needed in these environments, including easy of setup / containerization and security enhancements.

#### Admin Account
* username: admin@ictcore.org
* password: helloAdmin

#### User Account
* username: user@ictcore.org
* password: helloUser


Credits
=======
ICTFAX is developed by [ICT Innovations][developer]
ICTFax developed over [ictcore] , a open source freeswitch based framework for developers 
