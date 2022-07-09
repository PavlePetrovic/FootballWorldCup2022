async function worldCup(){ 
    // Pozivamo JSON fajl sa timovima:
    let allGroups = await fetch('./groups.json')
    .then(data => data.json())
    .catch(err =>console.log(err))

    
    let tapeStyle = `background-color: #D62828; 
                      font-weight: bold; 
                      color: white; 
                      border-left: 3px solid white; 
                      border-right: 3px solid white`;
    console.log('%c   GRUPNA FAZA    GRUPNA FAZA    GRUPNA FAZA   ', tapeStyle);

    /* --- GRUPNA FAZA --- */

    // Odigravanje grupne faze svetskog prvenstva:
    function groupStage(groups) {

        // Odigravanje svih utakmica u grupnoj fazi:
        groups.forEach( group => {
            let allMatchesInGroup = []

            // Biramo tim koji trenutno igra, odnosno, biramo svaki tim iz grupe u kojoj iteriramo.
            for( let i = 0; i < group.length; i++ ){
                let host = group[i]
                let hostName = group[i].name
                
                // Sa prethodno odabranim timom uporedjujemo sve preostale timove iz grupe, izuzimajuci njega:
                for( let j = 0; j < group.length; j++ ){
                    let guest = group[j]
                    let guestName = group[j].name
                    
                    // Osiguravamo da trenutni tim sa kojim igramo ne igra sam sa sobom i ne ponavlja utakmicu koju je vec igrao protiv nekog tima:
                    if(host != guest && !guest.played.includes(hostName)){
                        let goalNumber = () => Math.floor(Math.random() * 5)
                        // Rezultati uvek budu razliciti, u svakom lupu se menjaju i od toga zavisi ishod utakmice i ostala statistika:
                        let hostRes = goalNumber()
                        let guestRes = goalNumber()

                        // U objektu, imamo properti played, gde svaki tim pamti ime protivnickog tima.
                        // Kasnije to koristimo kako bi videli sa kim je sve trenutni tim igrao, kako ne bi ponovili utakmicu
                        host.played.push(guest.name)
                        guest.played.push(host.name)

                        // U array allMatchesInGroup saljemo imena i rezultate timova sa utakmice koja se trenutno odigrala:
                        allMatchesInGroup.push(`${hostName} ${hostRes}:${guestRes} ${guestName}`)

                        if( hostRes > guestRes ){
                            // Pobeda: true, Poraz: false, Nereseno: null
                            host.playedStats.push({
                                                        name: guestName, 
                                                        res: true
                                                    })
                            guest.playedStats.push({
                                                    name: hostName, 
                                                    res: false
                                                })
                            
                            host.stats.win = host.stats.win + 1
                            host.stats.passG = host.stats.passG + hostRes
                            host.stats.recG = host.stats.recG + guestRes
                            host.score = host.score + 3
                            
                            guest.stats.passG = guest.stats.passG + guestRes
                            guest.stats.recG = guest.stats.recG + hostRes
                            guest.stats.los = guest.stats.los + 1                              
                        } else if( hostRes < guestRes ){
                            host.playedStats.push({
                                                        name: guestName, 
                                                        res: false
                                                    })
                            guest.playedStats.push({
                                                    name: hostName, 
                                                    res: true
                                                })
                            
                            guest.stats.win = guest.stats.win + 1
                            guest.stats.passG = guest.stats.passG + guestRes
                            guest.stats.recG = guest.stats.recG + hostRes
                            guest.score = guest.score + 3
                            
                            host.stats.passG = host.stats.passG + hostRes
                            host.stats.recG = host.stats.recG + guestRes
                            host.stats.los = host.stats.los + 1    
                        } else{
                            host.playedStats.push({
                                                        name: guestName, 
                                                        res: null
                                                    })
                            guest.playedStats.push({
                                                    name: hostName, 
                                                    res: null
                                                })

                            host.stats.passG = host.stats.passG + hostRes
                            host.stats.recG = host.stats.recG + guestRes
                            host.stats.same = host.stats.same + 1
                            host.score = host.score + 1
                            
                            guest.stats.passG = guest.stats.passG + guestRes
                            guest.stats.recG = guest.stats.recG + hostRes
                            guest.stats.same = guest.stats.same + 1
                            guest.score = guest.score + 1
                        }
                    }
                }
            } 

            // Ispisujemo rezultate grupne faze po kolima i grupama.
            // Posto svaki put iterujemo kroz razlicitu grupu, od prvog tima uzimamo ime grupe |group[0].name|.
            let style = 'color: #bada55; font-weight: bold;'
            console.log(`%c Grupna faza - Grupa: ${group[0].group}`, style);

            let brKola = 1
            for ( let i = 0; i < allMatchesInGroup.length; i++ ){
                let style = 'color: #FCBF49; font-style: italic;'
                // Ispisujemo rezultate uvek kada je i paran broj, tako dobijamo podele u 3 kola.
                // Indekse utakmica postavljamo tako da se u jednom kolu, nikada 2 puta ne pojavi isti tim.
                if ( i === 0 ){
                    console.log(`%c    Kolo ${brKola++}`, style);
                    console.log(`      | ${allMatchesInGroup[5]}`);
                    console.log(`      | ${allMatchesInGroup[0]}`);
                } else if ( i === 2){
                    console.log(`%c    Kolo ${brKola++}`, style);
                    console.log(`      | ${allMatchesInGroup[3]}`);
                    console.log(`      | ${allMatchesInGroup[2]}`);
                } else if ( i === 4){
                    console.log(`%c    Kolo ${brKola++}`, style);
                    console.log(`      | ${allMatchesInGroup[4]}`);
                    console.log(`      | ${allMatchesInGroup[1]}`);
                }
            }
        })
    }
    groupStage(allGroups)

    // Sortiranje timova po rezultatima:
    function groupStageSortingScore(groups){
        groups.map( group => {
            return group.sort( (a, b) => {
                let goalDiffTeamB = b.stats.passG - b.stats.recG
                let goalDiffTeamA = a.stats.passG - a.stats.recG

                if ( b.score > a.score || b.score < a.score ){
                    return b.score - a.score

                } else if ( b.stats.recG === 0 || a.stats.recG === 0 ){
                    return a.stats.recG - b.stats.recG 

                } else if( goalDiffTeamB === 0 || goalDiffTeamA === 0 ) {
                    // Ako je razlika golova 0, onda rangiramo timove po postignutim golovima
                    return b.stats.passG - a.stats.passG

                } else if( goalDiffTeamB < 0 || goalDiffTeamA < 0 ){
                    return b.stats.passG - a.stats.passG
                    
                } else if ( goalDiffTeamB < goalDiffTeamA || goalDiffTeamB > goalDiffTeamA ){
                    // Ko ima vecu razliku izmedju datih i primljenih ide gore
                    return goalDiffTeamB - goalDiffTeamA

                } else if ( b.stats.passG < a.stats.passG || b.stats.passG > a.stats.passG ){
                    return b.stats.passG - a.stats.passG

                } else {
                    // Definisemo imena trenutnih timova koje uporedjujemo
                    let nameTeamB = b.name
                    let nameTeamA = a.name

                    // Pravimo varijable gde smestamo indekse protivnickih timova koje smo izukli iz statistike
                    let indexTeamB
                    let indexTeamA

                    // Kada se poklopi ime tima A i ime tima A iz baze tima B [playedStats], izvlacimo indeks tima B iz playedStats i cuvamo ga u varijabli:
                    // Tako mozemo da vidimo da li je tim pobedio, izgubio ili odigrao nereseno sa protivnickim.
                    for ( let i = 0; i < b.playedStats.length; i++ ){
                        let nameFromStatsTeamA = b.playedStats[i].name
                        if ( nameTeamA === nameFromStatsTeamA ){
                            indexTeamB = i
                        }
                    }
                    // Isto kao prethondo samo za tim A
                    for ( let i = 0; i < a.playedStats.length; i++ ){
                        let nameFromStatsTeamB = a.playedStats[i].name
                        if ( nameTeamB === nameFromStatsTeamB ){
                            indexTeamA = i
                        }
                    }

                    // Da li su rezultati true ili false? Ako nisu, odnosno nereseno, nastavljamo dalje
                    // sa random odabirom protivnika
                    // Ukoliko jesu, rangiramo ih po njima. True = 1 / False = 0
                    if ( b.playedStats[indexTeamB].res === true ||
                            b.playedStats[indexTeamB].res === false || 
                            a.playedStats[indexTeamA].res === true ||
                            a.playedStats[indexTeamA].res === false ) {

                        return b.playedStats[indexTeamB].res - a.playedStats[indexTeamA].res

                    } else {
                        // Poslednja sansa, ako se svi prethodni rezulatati poklapaju, redjamo timove potpuno random
                        return 0.5 - Math.random()
                    }
                }
            })
        })
    }
    groupStageSortingScore(allGroups)

    console.log('%c   TABELA REZULTATA - GRUPNA FAZA   ', tapeStyle);

    // Ispisivanje rezultata timova po grupama, nakon grupne faze:
    function groupStageResultsTable(groups){
        groups.forEach( team => {
            console.log(`%c Grupa ${team[0].group}`, 'color: #bada55');
            team.forEach( t => {
                console.log(`    | ${t.name} (${t.rank})   ${t.stats.win}|${t.stats.same}|${t.stats.los}  ${t.stats.passG}:${t.stats.recG}   ${t.score}`);
            })
        })
    }
    groupStageResultsTable(allGroups)

    console.log('%c   ELIMINACIONA FAZA  ELIMINAZIONA FAZA   ', tapeStyle);
    console.log('%c   Kolo 16', 'color: #FCBF49; font-style: italic;');

    /* --- KOLO 16: --- */

    // Sortiramo timove za sledecu fazu i smestamo u teamsRoundOf16 array:
    let teamsRoundOf16 = []
    function roundOf16SortingGroups(groups){
    // Iz svake grupe skidamo poslednja dva tima, zato sto se nisu plasirali dalje.
        groups.forEach(group => {
            group.splice(2)
        })
        // Preostala 16 timova delimo u 4 grupe po 4 tima:
        // Spavajamo |A i B| - |C i D| - |E i F| - |G i H|
        let g1 = []
        let g2 = []
        let g3 = []
        let g4 = []
        allGroups.forEach( (group, i) => {
            group.forEach( team => {
                if ( i <= 1){
                    g1.push(team)
                } else if ( i <= 3 ){
                    g2.push(team)
                } else if ( i <= 5 ){
                    g3.push(team)
                } else {
                    g4.push(team)
                }
                }
            )
        })
        teamsRoundOf16.push(g1)
        teamsRoundOf16.push(g2)
        teamsRoundOf16.push(g3)
        teamsRoundOf16.push(g4)
    }
    roundOf16SortingGroups(allGroups)

    // U array teamsQuarterFinals, gde smestamo pobednike kola 16:
    let teamsQuarterFinals = []
    // Utakmice kola 16
    function roundOf16Matches(groups){
        groups.forEach(group => {
            // Odrzavamo utakmice izmedju 4 tima iz grupe u isto vreme, po principu A1:B2 / A2:B1 itd...
            // Pobednike saljemo u teamsQuarterFinals array:
            let goalNumber = () => Math.floor(Math.random() * 5)
            let resA1 = goalNumber() // 0 index
            let resB2 = goalNumber() // 3 index
            let resA2 = goalNumber() // 1 index
            let resB1 = goalNumber() // 2 index
            let teamA1 = group[0]
            let teamB2 = group[3]
            let teamA2 = group[1]
            let teamB1 = group[2]

            console.log(`     | (${teamA1.group}1)${teamA1.name} ${resA1}:${resB2} (${teamB2.group}2)${teamB2.name}`);
            console.log(`     | (${teamA2.group}2)${teamA2.name} ${resA2}:${resB1} (${teamB1.group}1)${teamB1.name}`);

            if ( resA1 > resB2 ){
                teamA1.playedStats.push({
                                        name: teamB2.name, 
                                        res: true
                                    })
                
                teamA1.stats.win = teamA1.stats.win + 1
                teamA1.stats.passG = teamA1.stats.passG + resA1
                teamA1.stats.recG = teamA1.stats.recG + resB2
                teamA1.score = teamA1.score + 3

                teamsQuarterFinals.push(teamA1)
            } else if ( resA1 < resB2 ){
                teamB2.playedStats.push({
                                        name: teamA1.name, 
                                        res: true
                                    })
                
                teamB2.stats.win = teamB2.stats.win + 1
                teamB2.stats.passG = teamB2.stats.passG + resB2
                teamB2.stats.recG = teamB2.stats.recG + resA1
                teamB2.score = teamB2.score + 3

                teamsQuarterFinals.push(teamB2)
            } else {
                let winRandomNum = () => Math.floor(Math.random() * 2)
                let winNum = winRandomNum()
                let winner = [teamA1, teamB2]

                winner[winNum].playedStats.push({
                                                name: winner[winNum].name, 
                                                res: true
                                            })
                
                winner[winNum].stats.win = winner[winNum].stats.win + 1
                if ( winNum === 0 ){
                    winner[winNum].stats.passG = winner[winNum].stats.passG + resA1
                    winner[winNum].stats.recG = winner[winNum].stats.recG + resB2
                } else {
                    winner[winNum].stats.passG = winner[winNum].stats.passG + resB2
                    winner[winNum].stats.recG = winner[winNum].stats.recG + resA1
                }
                winner[winNum].score = winner[winNum].score + 3

                teamsQuarterFinals.push(winner[winNum])
            }

            if ( resA2 > resB1 ){
                teamA2.playedStats.push({
                                        name: teamB2.name, 
                                        res: true
                                    })
                
                teamA2.stats.win = teamA2.stats.win + 1
                teamA2.stats.passG = teamA2.stats.passG + resA2
                teamA2.stats.recG = teamA2.stats.recG + resB1
                teamA2.score = teamA2.score + 3

                teamsQuarterFinals.push(teamA2)
            } else if ( resA2 < resB1 ){
                teamB1.playedStats.push({
                                        name: teamA1.name, 
                                        res: true
                                    })
                
                teamB1.stats.win = teamB1.stats.win + 1
                teamB1.stats.passG = teamB1.stats.passG + resB1
                teamB1.stats.recG = teamB1.stats.recG + resA2
                teamB1.score = teamB1.score + 3

                teamsQuarterFinals.push(teamB1)
            } else {  
                let winRandomNum = () => Math.floor(Math.random() * 2)
                let winNum = winRandomNum()
                let winner = [teamA2, teamB1]

                winner[winNum].playedStats.push({
                                                name: winner[winNum].name, 
                                                res: true
                                            })
                
                winner[winNum].stats.win = winner[winNum].stats.win + 1
                if ( winNum === 0 ){
                    winner[winNum].stats.passG = winner[winNum].stats.passG + resA2
                    winner[winNum].stats.recG = winner[winNum].stats.recG + resB1
                } else {
                    winner[winNum].stats.passG = winner[winNum].stats.passG + resB1
                    winner[winNum].stats.recG = winner[winNum].stats.recG + resA2
                }
                winner[winNum].score = winner[winNum].score + 3

                teamsQuarterFinals.push(winner[winNum])
            }
        })
    }
    roundOf16Matches(teamsRoundOf16)

    /* --- ČETVRTFINALE --- */

    console.log('%c   Četvrtfinale', 'color: #FCBF49; font-style: italic;');

    // U array teamsQuarterFinalsSorted, smestamo sortirane pobednike kola16:
    let teamsQuarterFinalsSorted = []
    function quarterFinalsSortingGroups(teams){
        // Sortiranje je po principu, ako su u utakmicama A1:B2 / B1:A2 pobedili A1 i B1, oni zajedno cine prvu grupu itd...
        let g1 = []
        let g2 = []
        let g3 = []
        let g4 = []
            teams.forEach( (team, i) => {
                if ( i <= 1){
                    g1.push(team)
                } else if ( i <= 3 ){
                    g2.push(team)
                } else if ( i <= 5 ){
                    g3.push(team)
                } else {
                    g4.push(team)
                }
                }
            )
        teamsQuarterFinalsSorted.push(g1)
        teamsQuarterFinalsSorted.push(g2)
        teamsQuarterFinalsSorted.push(g3)
        teamsQuarterFinalsSorted.push(g4)
    }
    quarterFinalsSortingGroups(teamsQuarterFinals)

    // U array teamsSemiFinals, smestamo pobednike cetvrtfinala:
    let teamsSemiFinals = []
    // Utakmice cetvrtinala:
    function quarterFinalsMatches(teams){
        teams.forEach( group => {
            let goalNumber = () => Math.floor(Math.random() * 5)
            let resD = goalNumber() // 0 index
            let resG = goalNumber() // 1 index
            let teamD = group[0]
            let teamG = group[1]

                console.log(`     | ${teamD.name} ${resD}:${resG} ${teamG.name}`);

            if ( resD > resG ){

                teamD.playedStats.push({
                                        name: teamG.name, 
                                        res: true
                                    })
                
                teamD.stats.win = teamD.stats.win + 1
                teamD.stats.passG = teamD.stats.passG + resD
                teamD.stats.recG = teamD.stats.recG + resG
                teamD.score = teamD.score + 3

                teamsSemiFinals.push(teamD)

            } else if ( resD < resG ){

                teamG.playedStats.push({
                                        name: teamD.name, 
                                        res: true
                                    })
                
                teamG.stats.win = teamG.stats.win + 1
                teamG.stats.passG = teamG.stats.passG + resG
                teamG.stats.recG = teamG.stats.recG + resD
                teamG.score = teamG.score + 3

                teamsSemiFinals.push(teamG)

            } else {

                let winRandomNum = () => Math.floor(Math.random() * 2)
                let winNum = winRandomNum()
                let winner = [teamD, teamG]

                winner[winNum].playedStats.push({
                                                name: winner[winNum].name, 
                                                res: true
                                            })
                
                winner[winNum].stats.win = winner[winNum].stats.win + 1
                if ( winNum === 0 ){
                    winner[winNum].stats.passG = winner[winNum].stats.passG + resD
                    winner[winNum].stats.recG = winner[winNum].stats.recG + resG
                } else {
                    winner[winNum].stats.passG = winner[winNum].stats.passG + resG
                    winner[winNum].stats.recG = winner[winNum].stats.recG + resD
                }
                winner[winNum].score = winner[winNum].score + 3

                teamsSemiFinals.push(winner[winNum])

            }
        })
    }
    quarterFinalsMatches(teamsQuarterFinalsSorted)

    /* --- POLUFINALE --- */

    console.log('%c   Polufinale', 'color: #FCBF49; font-style: italic;');

    // U array teamsSemiFinalsSorted, smestamo sortirane pobednike cetvrtfinala:
    let teamsSemiFinalsSorted = []
    function semiFinalsSortingGroups(teams){
    let g1 = []
        let g2 = []
            teams.forEach( (team, i) => {
                if ( i <= 1){
                    g1.push(team)
                } else {
                    g2.push(team)
                }
                }
            )
        teamsSemiFinalsSorted.push(g1)
        teamsSemiFinalsSorted.push(g2)
    }
    semiFinalsSortingGroups(teamsSemiFinals)

    // U array teamsFinal smestamo poslednja dva tima koja se takmice u finalu:
    let teamsFinal = []
    // Utakmice polufinala:
    function semiFinalsMatches(teams){
        teams.forEach( group => {
            let goalNumber = () => Math.floor(Math.random() * 5)
            let resD = goalNumber() // 0 index
            let resG = goalNumber() // 1 index
            let teamD = group[0]
            let teamG = group[1]

                console.log(`     | ${teamD.name} ${resD}:${resG} ${teamG.name}`);

            if ( resD > resG ){

                teamD.playedStats.push({name: teamG.name, res: true})
                
                teamD.stats.win = teamD.stats.win + 1
                teamD.stats.passG = teamD.stats.passG + resD
                teamD.stats.recG = teamD.stats.recG + resG
                teamD.score = teamD.score + 3

                teamsFinal.push(teamD)

            } else if ( resD < resG ){

                teamG.playedStats.push({name: teamD.name, res: true})
                
                teamG.stats.win = teamG.stats.win + 1
                teamG.stats.passG = teamG.stats.passG + resG
                teamG.stats.recG = teamG.stats.recG + resD
                teamG.score = teamG.score + 3

                teamsFinal.push(teamG)

            } else {

                let winRandomNum = () => Math.floor(Math.random() * 2)
                let winNum = winRandomNum()
                let winner = [teamD, teamG]

                winner[winNum].playedStats.push({name: winner[winNum].name, res: true})
                
                winner[winNum].stats.win = winner[winNum].stats.win + 1
                if ( winNum === 0 ){
                    winner[winNum].stats.passG = winner[winNum].stats.passG + resD
                    winner[winNum].stats.recG = winner[winNum].stats.recG + resG
                } else {
                    winner[winNum].stats.passG = winner[winNum].stats.passG + resG
                    winner[winNum].stats.recG = winner[winNum].stats.recG + resD
                }
                winner[winNum].score = winner[winNum].score + 3

                teamsFinal.push(winner[winNum])

            }
        })
    }
    semiFinalsMatches(teamsSemiFinalsSorted)

    /* --- FINALE --- */

    console.log('%c   FINALE', 'color: #FCBF49; font-style: italic;');

    // Utakmice finala:
    function final(team){
        let goalNumber = () => Math.floor(Math.random() * 5)
        let resD = goalNumber() // 0 index
        let resG = goalNumber() // 1 index
        let teamD = team[0]
        let teamG = team[1]

            console.log(`     | ${teamD.name} ${resD}:${resG} ${teamG.name}`);

        if ( resD > resG ){

            teamD.playedStats.push({name: teamG.name, res: true})
            
            teamD.stats.win = teamD.stats.win + 1
            teamD.stats.passG = teamD.stats.passG + resD
            teamD.stats.recG = teamD.stats.recG + resG
            teamD.score = teamD.score + 3

            console.log(`%c ${teamD.name} je pobednik!!!`, 'font-weight: bold; font-size: 30px; color: #bada55;');

        } else if ( resD < resG ){

            teamG.playedStats.push({name: teamD.name, res: true})
            
            teamG.stats.win = teamG.stats.win + 1
            teamG.stats.passG = teamG.stats.passG + resG
            teamG.stats.recG = teamG.stats.recG + resD
            teamG.score = teamG.score + 3

            console.log(`%c ${teamG.name} je pobednik!!!`, 'font-weight: bold; font-size: 30px; color: #bada55;');

        } else {

            let winRandomNum = () => Math.floor(Math.random() * 2)
            let winNum = winRandomNum()
            let winner = [teamD, teamG]

            winner[winNum].playedStats.push({name: winner[winNum].name, res: true})
            
            winner[winNum].stats.win = winner[winNum].stats.win + 1
            if ( winNum === 0 ){
                winner[winNum].stats.passG = winner[winNum].stats.passG + resD
                winner[winNum].stats.recG = winner[winNum].stats.recG + resG
            } else {
                winner[winNum].stats.passG = winner[winNum].stats.passG + resG
                winner[winNum].stats.recG = winner[winNum].stats.recG + resD
            }
            winner[winNum].score = winner[winNum].score + 3

            console.log(`%c ${winner[winNum].name} je pobednik!!!`, 'font-weight: bold; font-size: 30px; color: #bada55;');
        }
    }
    final(teamsFinal)
}
worldCup();