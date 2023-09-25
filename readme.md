
MODULE SCHOOL_ROAD
--------------------
Modul til beregning af afstand fra skole til elev.
Bruges til at se om elev er berettiget til buskort.

DEPRECATION
--------------------
Deprecates: none         
Deprecated by: none

DOCUMENTATION
--------------------
No external documentation

INSTALLATION
--------------------

1: Installation  
1a: Tilføj følgende linje til modules filen:

      <module name="school_road" dir="custom/school_road" permissionlevel="public" />

2: Tilføj parametrer til relevante cbinfo-filer:
2a: Parameteren skal indholde minimapid'et fra det ønskede minimap

	<param name="module.school_road.minimapid">d2c4h790-f45c-4fed-a2vb-sfgo954vhke1</param>

3: Ret parametrer i deploy.xml:

	<param name="module.school_road.route.profile">skolerute</param>
	<param name="module.school_road.logo">/images/custom/Lolland9.png</param>

4: Ret datasources.xml
4a: Så den peger på en tabel med punkter for hver skole og skoledistrikter:

	<datasource endpoint="ep_lk_school_road" name="lk_school_road_skoler">
		<table geometrycolumn="geom" name="skoler" pkcolumn="id" schema="skoler"/>
	</datasource>

4b: Tabellen 'skoler' skal indeholde disse atributter:
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

4c: Tabellen 'skoledistrikter' skal indeholde disse atributter:
      udd_distrikt_navn: string;
      geom: geometry(MULTIPOLYGON);

PARAMETERS
--------------------
<param name="module.school_road.minimapid">d2c4h790-f45c-4fed-a2vb-sfgo954vhke1</param>
<param name="module.school_road.route.profile">skolerute</param>
<param name="module.afstand.spsroute.routeservice">/spsroute/api/1.0</param>
<param name="module.school_road.logo">/images/custom/Lolland9.png</param>

Read [here](https://docs.spatialsuite.com/?valgtedokument=1248) about best practices when defining parameters.


LIMITATIONS
--------------------
None

DEPENDENCIES
--------------------
Modulet bygger på SpsRouter.
Det er en forudsætning, at SpsRoute Routing Service er installeret, hvor løsningen skal bruges.

CHANGES
--------------------
```
Date           Version        Ini            Description 
2022-11-16     1.0.0          MARPO          Modulet oprettet
2022-12-22     1.1.0          MARPO          Rutebeskrivelse tilføjet
2023-01-04     1.2.0          MARPO          Tjek om elev og skole ligger i samme distrikt
2023-09-25     1.2.0          MARPO          Skiftet til at bruge parameteren [module.afstand.spsroute.routeservice]

```