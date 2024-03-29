
<READER>

<M>

<H class="black shadow">

## Project management is risk management, and for software development, project management is one of the risks

<E>

2nd February 2014

## Introduction

Reports of spectacular failures in all sorts of UK government development projects have become a common news feature in recent times. Local examples in construction include the spiralling costs of the Scottish Parliament building, and the ongoing saga of the TIE initiative Edinburgh Trams project, which has devolved into some sort of "Innocent Scots Politicians vs ze Evil Germans" comic tragedy played out via the medium of local news media, and set on a stage of broken roads and traffic jams.

Yet from these examples, there emerges a sense of something getting done. The parliament project may have spiralled out of control in terms of cost, but at the end of the day there is a building there - the spending had a result, and some people even like it. So too in the case of the trams - walking along Princes Street is much more pleasing to the ear (if not the eye) these days, and at some point there will probably be a tram somewhere in the city. However, in the case of software development projects, it can on occasion be harder to identify any benefit - sometimes the money just seems to sink into a developmental black hole.

Of course, there are significant controls placed on governmental software development projects; targets to meet, reporting to be done, resource constraints to be met, and so on. In fact, there are a raft of project management models and specifications that can be applied in such cases but still, catastrophes are regularly reported. The ongoing and seemingly never-ending increases in cost and scope of NPfIT [1], the failure of ministerial email systems, and regular security breaches are some recent examples.

I intend therefore to examine one such development failure in order to highlight the project management issues that occurred, and to use the findings to argue that it is possible to confuse software development and project management activities, leading to the very failures that project management techniques should serve to avoid.



## National Offender Management Information System

The National Offender Management Information System (NOMS) project was initiated in 2004 by HM Prisons Service (HMP) [2] and the National Probation Service (NPS) [3]. Intended improvements and benefits included:

* one central record for each offender
* one shared database for all prisons and probation centres
* availability of information to prison and probation officers
* having one case handler for each offender during their transition through the convict/parolee process
* better handling of offenders throughout their time as both convicts and parolees


                                   
This project is ideal for the analysis I wish to perform, in part because of how comprehensively it failed, but also because it commenced shortly after publication in 2002 of government recommendations [4] on how to manage projects just like this one. Finally, a National Audit Office (NAO) report was published on 12th March 2009, detailing the failures and comparing them to the government guidelines [5] :

* Total Failure - To provide senior management and ministerial ownership and leadership
* Total Failure - Lack of skills and proven approach to project management and risk management
* Total failure - Lack of understanding of and contact with the supply industry at senior levels of the organisation
* Total failure - Lack of effective project team integration between clients, the  supplier team and the supply chain
* Partial failure - Evaluation of proposals driven by initial price rather than long term value for money (especially securing delivery of business benefits)
* Partial Failure - Lack of clear link between the project and the organisation's key strategic priorities, including agreed measures of success
* Partial Failure - Lack of effective engagement with stakeholders
* Success - Development and implementation successfully broken down into manageable steps


The project failed completely on four of the guidelines, and partially on three. Only one guideline was satisfactorily achieved.

During the course of the project, spending reached Â£350,000 per day [6]. Considering the project requirements [7], it is hard to imagine how this vast sum of money could have been spent. Initial cost forecasts included approximately Â£128m for system maintenance and support, however this did not include hardware, staff training, or refreshing equipment. For approximately Â£8m per year, it seems that the sole goal was to develop a database to hold around 1.5m records, and suitable, quantifiable access methods onto that data. This is not a comparatively significant problem in terms of database or user management; therefore, assuming there was no crime taking place, there must have been some other cause for spending on a level so high that it resulted in the project being more than twice over budget after just four years.

The NAO report also states that "the original plan is not needed in order to perform the requirements of end-to-end offender management" [8]. It seems then that the technical goals of the system do not even fulfil the requirements of the system. Indeed, the genius of database design, in software terms, is its ability to do what it does transparently from the perspective of the user; a user need not care how many instantiations of a database there are for the data they need. Users just want to be able to access data easily and uniformly - this does not necessarily imply the need for one database, and it is unclear where this requirement was derived.

Certainly, the end result of reducing 220 databases to one may benefit administration and maintenance, but unnecessarily adhering to such a superfluous design target can presents limitations. For example, storing the data in three databases (which is in fact the new specification) still represents a significant reduction from 200, but also allows more development flexibility.

It is clear that the drivers for the NOMS project did not seem to be user requirements. Also, it does not appear that the requirements that were in place were useful or achievable. The project seems to have been operating at cross-purposes. What these cross-purposes were is highlighted in point 2.10 of the NAO audit, stating "C-NOMIS was treated as an IT project rather than a major IT-enabled business change programme". I believe that this was the flaw in the  foundation that caused the collapse of the NOMS project.

At inception of the NOMS project, HMP and NPS were in the process of merging into a new unit to handle prisoner/parolee administration. NOMS itself was the newly formed amalgamation, so it involved new people interacting in new ways. Whilst such an infrastructural change provided an ideal opportunity to develop new business practices, it was viewed instead as a time to develop a system for which no-one could specify the requirements, and to build that system simply to emulate what was already being done by two disparate groups. However during the merge process, roles changed, requirements shifted, business practices were redefined; but these changes were not handled in and of themselves, but were treated as new requirements for the NOMS IT system to meet.

Software developments often require changes to administrative processes within the deployment environment; but to a large extent, the process change is the driver for improvements rather than the software itself. These issues can become confused, because new software does seem to cause efficiency gains - but only if the new software is used in a suitable manner. Developing collaborative input processes to the content of a redeveloped website, for example, is not contingent on having a particular content management system (CMS) in place - it hinges on changing the process by which people do the job. The CMS is just a tool and it should suit the job; if it does not, it should be replaced with one that does. Clinging to a failing or ill-suited tool will simply hinder the newly developed process.

In my introduction I mentioned examples of non-software related development projects. In those cases, it is easy to make a clear definition between process and tools; it is also clear to see what it is that the project produces; a building, or a transport network, for example. But in the case of the NOMS project, the software under development was confused with the actual change process occurring within the newly-amalgamated HMP and NPS. The end result was a project attempting to build an office capable of doing the job of its occupants.

This confusion is the underlying cause of the catastrophic failure of the NOMS project; all subsequent project management techniques applied, and decisions made, were doomed as a result. In software development, coding is only a small part of the work; the rest is in planning, gathering requirements, and meeting them - which are key factors of project management. Because of this extensive overlap there is increased risk of software development projects failing in this manner. In contrast, it is unlikely that TIE would become similarly confused over the Edinburgh trams network - no matter how complex the project management issues becomes, there is still a clear physical reminder of the state that the project is in right now - and the TIE executives probably drive through that reminder every day.

Of course, that is not to say that the TIE project will not become hugely over budget, or even fail completely; perhaps it will. However it will not be as a result of the type of confusion suffered by NOMS.



## Project management

In the NOMS project, it seems that the project management cycle itself became the driver for the project; as the underlying structure of the departments that the system was meant to serve were undefined at the beginning (due to the merger), any changes that were raised as a result of business change were taken to be required changes for the project. As such, it spiralled out of control, having no fixed requirements to meet, nor users to satisfy. As was shown in the NAO report, the project management model failed on almost all fronts.

Unfortunately, such failures cannot be avoided simply by abandoning project management techniques, though there are some interesting examples that suggest abandonment could be a fine course of action. For example, another hugely expensive government project to develop a search mechanism over all data available from local councils [9] looked somewhat ridiculous when some understandably annoyed (but technically proficient) tax payers took it upon themselves to develop an equally useful system in under an hour. (Their project also failed to meet the target completion time, although they "still finished before lunch" [10].)

Project management can be very beneficial - there are companies whose core business is to provide good project management [11]. However, it is most important that it is applied effectively, or it can become more of a beast than the job itself. Unfortunately, the more lightweight project management styles [12] tend to rely on iterative processes and less so on initial predictions, which can make funding projections seem less certain. Such predictions can be wildly inaccurate, but if securing funding is contingent on having those figures to hand, a project manager may feel pressured into using a method that provides such figures.

Lorin May describes in an article the various ways in which software projects can fail [13]. Similar points are raised to those brought up by the government guidelines to which the NOMS project was compared:


* poor user input
* stakeholder conflicts
* vague requirements
* poor cost and schedule estimation
* skills that do not match the job
* hidden costs of going lean and mean
* failure to plan
* communication breakdowns
* poor architecture
* late failure warning signals

 
Evidence for nine of this set of ten could be found in the NOMS project. It seems then that there is plenty of documentation detailing how a project can fail - there are government recommendations on what common failures to avoid, there are articles detailing those failures, and there are companies that offer specialist project management experience. There is also an IEEE standard to follow when developing a software project management plan [14]. With so much detailed documentation and assistance available, it appears that project management itself is a risky business.




## Risk management

Project management is sometimes viewed as a component for large scale projects. But this idea can be self perpetuating, in that it implies project management is a large scale investment; thus, implementing a monolithic project management strategy can result in a large project. Particularly in the case of software development projects, where a significant portion of the work is similar to project management, applying yet more principles and strategies can become excessive.

I once worked on a project to migrate the contents of a database from one type to another. The goal of the project was to avoid the Y2K phenomenon, as the original database had been deemed susceptible to the bug. A great deal of project planning was carried out, executives had their say, users were consulted, and testing was carried out. Shortly before the migration date, someone discovered that the new system also suffered from the Y2K bug - it had not been tested. The software purpose of the project had become swamped in project management, and the project continued. At huge expense, the data was migrated and staff were retrained. In the end, the bug was avoided due to all the work that had gone into sorting and cleaning the data for the move - but of course, that could have been done without moving to a different database.

Robert Charette details [15] the way in which projects are occasionally viewed as monolithic waterfall-type structures, where one outcome leads clearly to the next, and where changes are fed in at one end and result in a neat push through the system. Historically, he explains, project management strategies grew from the successes of large scale science projects in the early 1900s; such strategies were incorporated into business cases and applied to other domains. Unfortunately, the clearly defined goals that those earlier projects relied on, and in some cases had to meet at all costs, did not necessarily carry over to more flexible domains. This resulted in poor development of risk assessments in the case of these "post-normal" projects.

More modern large scale projects do have intended outcomes, but those outcomes can be flexible. As the outcomes change, the risks also change. Thus in order for the project to remain flexible and reflective of the requirements of its stakeholders, it is the changing risks that must be considered most. Otherwise the monolithic project, when presented with new goals, fails to analyse their requirements and tries to hammer them into the ongoing developments, resulting in something that does not resemble any real user requirement, and is of no use.

For all development projects, it is vitally important that clear requirements are defined, that any projections are reasonable, that the project is flexible in handling changes to requirements, and that a proper risk analysis is carried out over all these points. This is particularly important for software development projects, as they are essentially projects to build tools for users. Thus, if the user cannot use the tool, it will be abandoned.

In the case where a software development project is part of an overarching project, for example to implement process change in an administrative environment, care must be taken to ensure that the project management goals do not encroach on user requirements. This is how the NOMS project should have been implemented; then, with the software development requirements laid out as a clear subfunction of the overall project to drive process change in the administrative environment, a proper set of user requirements could have been defined. This would have enabled the software developers to perform a suitable risk analysis, and to keep track of user requirements for the database tool, rather than the failing requirements of the overall project.

There is a paradox surrounding risk analysis: it is avoided, because declaring risk is risky . . . yet not declaring it is more so. There are enough examples now of what happens when such analyses are not carried out, when ill conceived projects confuse software development and business change requirements.



## Conclusions

One must be resolute when implementing project management techniques to ensure that suitable risk analysis is performed, and not to shy away on the pretence that a project is not risky; suitable project management techniques should be applied, not based on their suitability to generate predictions that will most likely be wrong, but on their ability to be flexible enough to accommodate the risks the project presents.

In developing any project, there must be a clearly defined need. The user requirements must be first and foremost for any software development, because if the resulting tool is not right for the job, it will not be put to good use. The software project must deliver what the user needs.

When analysing risk for a software development project, part of that analysis should include a check on the project management techniques in place as part of any overarching project, for example business change. This analysis is required in order to ensure that the software development aspect continues to be driven by the real customer requirements, rather than becoming a dumping ground for failed requirements of other areas of the project.

This is why I conclude that although project management may be risk management, in the case of software development, project management is one of those risks; because if the end customer is not kept in mind - if the beast that is the project becomes master - the end result will be a tool built to the wrong specifications.





## References

[1] NHS National Programme for IT<br>
http://www.connectingforhealth.nhs.uk

[2] Her Majesty's Prison Service<br>
http://www.hmprisonservice.gov.uk

[3] National Probation Service<br>
http://www.probation.homeoffice.gov.uk

[4] National Audit Office and Office of Government Commerce, Common Causes of Software Failure.<br>
http://www.ogc.gov.uk/documents/Project_Failure.pdf

[5] National Audit Office, The National Offender Management Information System.<br>
http://www.nao.org.uk/publications/0809/national_offender_management.aspx

[6] ref [5], p12.

[7] ref [5], p17.

[8] ref [5], p7.

[9] Direct Gov<br>
http://direct.gov.uk

[10] Directionless Gov<br>
http://directionlessgov.com

[11] Accenture<br>
http://www.accenture.com

[12] Extreme Programming<br>
http://www.extremeprogramming.org

[13] L.J. May, Major Causes of Software Project Failures.<br>
http://stsc.hill.af.mil/crosstalk/1998/07/causes.asp

[14] IEEE Std 1058-1998, IEEE Standard for Software Project Management Plans.<br>
http://ieeexplore.ieee.org/xpl/freeabs_all.jsp?arnumber=741937

[15] R.N. Charette, Large-Scale Project Management Is Risk Management, IEEE Software July 1996.<br>
http://www.spectrum.ieee.org/xplore/2047

