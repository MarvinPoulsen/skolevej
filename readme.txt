
--------------------
OM SKOLEVEJ
--------------------

Modul til beregning af afstand fra skole til elev.
Bruges til at se om elev er berettiget til buskort.


--------------------
INSTALLATION
--------------------

1:	Installér modulet
	Tilføj følgende linje til modulfilen:
		<module dir="custom/school_road" name="school_road" permissionlevel="public"/>

2:	Tilføj parametrer til relevante cbinfo-filer:
	Parameteren skal indholde minimapid'et fra det ønskede minimap
		<param name="module.school_road.minimapid">d2c4h790-f45c-4fed-a2vb-sfgo954vhke1</param>

3:	Ret parametrer i deploy.xml:
	<param name="module.school_road.route.profile">skolerute</param>
	<param name="module.school_road.logo">/images/custom/Lolland9.png</param>

4:	Ret datasources.xml
	Så den peger på en tabel med punkter for hver skole:

	<datasource endpoint="ep_lk_school_road" name="lk_school_road_skoler">
		<table geometrycolumn="geom" name="skoler" pkcolumn="id" schema="skoler"/>
	</datasource>

	Tabellen skal indeholde disse atributter:
		id: serial4 NOT NULL;
		skole: string;
		vejnavn: string;
		husnummer: string;
		postnummer: number;
		by: string;
		geom: geometry(point);
		
--------------------
DEPENDENCIES
--------------------
Modulet bygger på SpsRouter.
Det er en forudsætning, at SpsRoute Routing Service er installeret, hvor løsningen skal bruges.

--------------------
CHANGES
--------------------
Date		Version		Ini		Description
2022-11-16	1.0.0		MARPO		Modulet oprettet
2022-12-22	1.1.0		MARPO		Rutebeskrivelse tilføjet