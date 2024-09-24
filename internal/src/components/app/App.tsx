import React, { FC, useRef, useState } from 'react';
import Map from '../minimap/Minimap';
import Form from '../form/Form';
import Navbar from '../navbar/Navbar';
import { schoolsMinimapId } from '../../../config';
import Summary from '../summary/Summary';
import './app.scss';

export interface SkoleDataRow {
    id: string;
    skole: string;
    vejnavn: string;
    husnummer: string;
    postnummer: number;
    by: string;
    shape_wkt: { wkt: string };
}
export interface DistrikterDataRow {
    id: string;
    udd_distrikt_navn: string;
    shape_wkt: { wkt: string };
}

const App: FC = () => {
    const minimap: any = useRef(null);
    const [skoleData, setSkoleData] = useState([]);
    const [result, setResult] = useState();
    const [logo, setLogo] = useState();
    const [kommunenr, setKommunenr] = useState();

    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('lk_school_road_skoler');
        ds.execute({ command: 'read' }, (rows: SkoleDataRow[]) => {
            const data = rows.map((element) => {
                const wkt = element.shape_wkt.wkt;
                const start = wkt.search(/[0-9]/);
                const end = wkt.search(/[)]/);
                const subStr = wkt.substring(start, end);
                const latLong = subStr.replace(' ', ',');
                const adresse = `${element.vejnavn} ${element.husnummer}, ${element.postnummer} ${element.by}`;
                return {
                    id: parseInt(element.id as string),
                    skole: element.skole,
                    adresse,
                    latLong,
                };
            });
            setSkoleData(data);
        });
        const siteUrl = minimap.current.getSession().getParam('cbinfo.site.url');
        const logoUrl = minimap.current.getSession().getParam('module.school_road.logo');
        const kommunenummer = minimap.current.getSession().getParam('config.kommunenr.firecifre');
        setLogo(siteUrl + logoUrl);
        setKommunenr(kommunenummer);
    };

    const calculate = async (
        schoolId: number,
        toCoord: string,
        distance: string,
        endAddress: string,
        grade: string
    ) => {
        const siteUrl = minimap.current.getSession().getParam('cbinfo.site.url');
        const apiUrl = minimap.current.getSession().getParam('module.afstand.spsroute.routeservice');
        const routeProfile = minimap.current.getSession().getParam('module.school_road.route.profile');
        const school = skoleData.find((item) => item.id === schoolId);
        const url = `${siteUrl}${apiUrl}/route?profile=${routeProfile}&from=${school.latLong}&to=${toCoord}&srs=epsg:25832&lang=da`;
        const req = await fetch(url);
        const result = await req.json();
        minimap.current.getMapControl().setMarkingGeometry(result.wkt, true, null, 100);
        const addressCoords = toCoord.split(',');
        const addressWkt = `POINT(${addressCoords[0]} ${addressCoords[1]})`;
        const dsDistrict = minimap.current.getSession().getDatasource('lk_school_road_skoledistrikter');
        dsDistrict.execute({command: 'read-intersects',school_id: schoolId,address_wkt: addressWkt,},(rows: DistrikterDataRow[]) => {
            const district =
                rows.length > 0
                    ? rows[0].udd_distrikt_navn
                    : school.skole === 'International skole' || school.skole === 'Specialskolens afdeling Horslunde'
                    ? 'Har skoledistrikt i hele kommunen'
                    : null;
            const res = {
                ...result,
                distance: parseInt(distance),
                endAddress,
                schoolName: school.skole,
                schoolAddress: school.adresse,
                grade: grade,
                district,
            };
            setResult(res);
        }
        );
    };

    return (
        <>
            <section className="hero is-info is-small">
                {logo && <Navbar logo={logo} />}
            </section>
            <section className="section">
                <div className="container">
                    <div className="columns">
                        <div className="column is-4 box">
                            {kommunenr && (
                                <Form
                                    data={skoleData}
                                    onCalculate={calculate}
                                    kommunenr={kommunenr}
                                />
                            )}
                        </div>
                        <div className="column is-4">
                            {result && (
                                <Summary
                                    travelDistanceInMeter={
                                        result.travelDistanceInMeter
                                    }
                                    instructions={result.instructions}
                                    distance={result.distance}
                                    endAddress={result.endAddress}
                                    schoolName={result.schoolName}
                                    schoolAddress={result.schoolAddress}
                                    grade={result.grade}
                                    district={result.district}
                                />
                            )}
                            {!result && (
                                <article className="message is-light">
                                    <div className="message-body">
                                        <div className="content">
                                            <p>
                                                Få beregnet om en elev er
                                                berettiget til godtgørelse.
                                            </p>
                                            <ul>
                                                <li>Vælg skole.</li>
                                                <li>Indtast elevadressen.</li>
                                                <li>Vælg klassetrin.</li>
                                                <li>Klik på Beregn.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </article>
                            )}
                        </div>
                        <Map
                            id={schoolsMinimapId}
                            name="schools"
                            size="is-4"
                            onReady={onMapReady}
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default App;
