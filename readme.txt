
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
	Så den peger på en tabel med punkter for hver skole og skoledistrikter:

	<datasource endpoint="ep_lk_school_road" name="lk_school_road_skoler">
		<table geometrycolumn="geom" name="skoler" pkcolumn="id" schema="skoler"/>
	</datasource>

	Tabellen 'skoler' skal indeholde disse atributter:
		id: serial4 NOT NULL;
		skole: string;
		vejnavn: string;
		husnummer: string;
		postnummer: number;
		by: string;
		geom: geometry(point);
	
    <datasource endpoint="ep_lk_school_road" name="lk_school_road_skoledistrikter">
        <table geometrycolumn="geom" name="skoledistrikter" pkcolumn="id" schema="skoler"/>
        <sql command="read-intersects">
            select  * 
            from skoler.skoledistrikter sd, skoler.skoler s  
            where st_intersects(st_geomfromtext([string: address_wkt], 25832),sd.geom)
            and s.id = [number: school_id] 
            and st_intersects(s.geom, sd.geom)
        </sql>
    </datasource>

	Tabellen 'skoledistrikter' skal indeholde disse atributter:
		udd_distrikt_navn: string;
		geom: geometry(MULTIPOLYGON);
	
		
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
2023-01-04	1.2.0		MARPO		Tjek om elev og skole ligger i samme distrikt
2023-01-05	1.2.1		MARPO		International skole har skoledistrikt i hele kommunen