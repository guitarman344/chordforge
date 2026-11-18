// ChordForge – libreria condivisa: note, accordi, diteggiature, diagrammi
const CF = (() => {
  const SHARP = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  const FLAT  = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
  const IT = {C:"DO",D:"RE",E:"MI",F:"FA",G:"SOL",A:"LA",B:"SI"};
  const LETTERS = ["C","D","E","F","G","A","B"];
  const LETTER_PC = [0,2,4,5,7,9,11];
  const ROOTS = [ // nome preferito per ogni semitono
    "C","C#","D","Eb","E","F","F#","G","Ab","A","Bb","B"];

  function toIt(name){ // "C#" -> "DO#", "Bb" -> "SIb"
    return name.replace(/^([A-G])/, (m)=>IT[m]);
  }
  function noteName(n, notation){ return notation==="it" ? toIt(n) : n; }

  // Tipi di accordo: famiglia, nome, suffisso, formula, gradi [offset lettera, semitoni]
  const GROUPS = ["Triadi","Seste","Settime","Sospesi","Estesi (9, 11, 13)","Alterati","Diminuiti e aumentati","Altri"];
  const T = (g,id,label,suf,formula,deg,uso) => ({g:GROUPS[g],id,label,suf,formula,deg,uso});
  const TYPES = [
    T(0,"maj","Maggiore","","1 – 3 – 5",[[0,0],[2,4],[4,7]],"Il più comune, suono pieno e allegro"),
    T(0,"m","Minore","m","1 – ♭3 – 5",[[0,0],[2,3],[4,7]],"Malinconico"),
    T(1,"6","Sesta","6","1 – 3 – 5 – 6",[[0,0],[2,4],[4,7],[5,9]],"Sapore anni '50 / swing"),
    T(1,"m6","Minore sesta","m6","1 – ♭3 – 5 – 6",[[0,0],[2,3],[4,7],[5,9]],"Minore elegante (jazz, tango)"),
    T(1,"69","Sesta e nona","6/9","1 – 3 – 6 – 9 (5)",[[0,0],[2,4],[4,7],[5,9],[1,2]],"Morbido e moderno, chiusura jazz e bossa"),
    T(2,"7","Settima","7","1 – 3 – 5 – ♭7",[[0,0],[2,4],[4,7],[6,10]],"Tensione che vuole risolvere (blues, V grado)"),
    T(2,"maj7","Settima maggiore","maj7","1 – 3 – 5 – 7",[[0,0],[2,4],[4,7],[6,11]],"Morbido, sognante (pop, bossa)"),
    T(2,"m7","Minore settima","m7","1 – ♭3 – 5 – ♭7",[[0,0],[2,3],[4,7],[6,10]],"Minore più morbido (soul, funk)"),
    T(2,"mMaj7","Minore settima maggiore","m(maj7)","1 – ♭3 – 5 – 7",[[0,0],[2,3],[4,7],[6,11]],"Misterioso, da colonna sonora (spy, noir)"),
    T(3,"sus2","Sus2","sus2","1 – 2 – 5",[[0,0],[1,2],[4,7]],"Aperto, sospeso"),
    T(3,"sus4","Sus4","sus4","1 – 4 – 5",[[0,0],[3,5],[4,7]],"Sospeso, spesso risolve sul maggiore"),
    T(3,"7sus4","Settima sus4","7sus4","1 – 4 – 5 – ♭7",[[0,0],[3,5],[4,7],[6,10]],"Sospeso con tensione"),
    T(3,"9sus4","Nona sus4","9sus4","1 – 4 – 5 – ♭7 – 9",[[0,0],[3,5],[4,7],[6,10],[1,2]],"Sospeso e moderno (soul, gospel)"),
    T(4,"add9","Add9 (nona aggiunta)","add9","1 – 3 – 5 – 9",[[0,0],[2,4],[4,7],[1,2]],"Maggiore 'brillante', molto usato nel pop"),
    T(4,"madd9","Minore add9","madd9","1 – ♭3 – 5 – 9",[[0,0],[2,3],[4,7],[1,2]],"Minore intenso, ballate"),
    T(4,"9","Nona","9","1 – 3 – 5 – ♭7 – 9",[[0,0],[2,4],[4,7],[6,10],[1,2]],"Funk e blues"),
    T(4,"maj9","Nona maggiore","maj9","1 – 3 – 5 – 7 – 9",[[0,0],[2,4],[4,7],[6,11],[1,2]],"Sognante, neo-soul e jazz"),
    T(4,"m9","Minore nona","m9","1 – ♭3 – 5 – ♭7 – 9",[[0,0],[2,3],[4,7],[6,10],[1,2]],"Minore ricco (R&B, jazz)"),
    T(4,"11","Undicesima","11","1 – 5 – ♭7 – 9 – 11 (3 di solito omessa)",[[0,0],[4,7],[6,10],[1,2],[3,5]],"Sospeso, gospel e fusion"),
    T(4,"m11","Minore undicesima","m11","1 – ♭3 – 5 – ♭7 – 11",[[0,0],[2,3],[4,7],[6,10],[3,5]],"Minore aperto, modale"),
    T(4,"13","Tredicesima","13","1 – 3 – ♭7 – 13 (5 e 9 spesso omesse)",[[0,0],[2,4],[4,7],[6,10],[1,2],[5,9]],"Blues e jazz, al posto del 7"),
    T(5,"7b9","Settima nona bemolle","7♭9","1 – 3 – 5 – ♭7 – ♭9",[[0,0],[2,4],[4,7],[6,10],[1,1]],"V grado nelle tonalità minori, tensione scura"),
    T(5,"7#9","Settima nona diesis","7♯9","1 – 3 – 5 – ♭7 – ♯9",[[0,0],[2,4],[4,7],[6,10],[1,3]],"L'accordo 'Hendrix': rock e funk"),
    T(5,"7b5","Settima quinta bemolle","7♭5","1 – 3 – ♭5 – ♭7",[[0,0],[2,4],[4,6],[6,10]],"Tensione jazz"),
    T(5,"7#5","Settima quinta aumentata","7♯5","1 – 3 – ♯5 – ♭7",[[0,0],[2,4],[4,8],[6,10]],"Tensione che sale verso la tonica"),
    T(6,"dim","Diminuito","dim","1 – ♭3 – ♭5",[[0,0],[2,3],[4,6]],"Passaggio tra due accordi"),
    T(6,"dim7","Diminuito settima","dim7","1 – ♭3 – ♭5 – ♭♭7",[[0,0],[2,3],[4,6],[6,9]],"Tensione forte, passaggio"),
    T(6,"m7b5","Semidiminuito","m7♭5","1 – ♭3 – ♭5 – ♭7",[[0,0],[2,3],[4,6],[6,10]],"II grado nelle tonalità minori (jazz)"),
    T(6,"aug","Aumentato","aug","1 – 3 – ♯5",[[0,0],[2,4],[4,8]],"Passaggio, suono 'sospeso nel vuoto'"),
    T(7,"5","Power chord (quinta)","5","1 – 5",[[0,0],[4,7]],"Né maggiore né minore: rock e metal, con distorsione"),
  ];
  const TYPE = Object.fromEntries(TYPES.map(t=>[t.id,t]));

  // Forme mobili: offset per corda 6→1 rispetto al tasto della tonica (null = corda muta)
  const X = null;
  const E_SHAPE = { // tonica sulla 6ª corda
    maj:[0,2,2,1,0,0], m:[0,2,2,0,0,0], "5":[0,2,2,X,X,X], "7":[0,2,0,1,0,0], maj7:[0,2,1,1,0,0],
    m7:[0,2,0,0,0,0], mMaj7:[0,2,1,0,0,0], "6":[0,2,2,1,2,0], m6:[0,2,2,0,2,0], sus4:[0,2,2,2,0,0],
    "7sus4":[0,2,0,2,0,0], "9":[0,2,0,1,0,2], add9:[0,X,2,1,0,2], madd9:[0,X,2,0,0,2],
    maj9:[0,X,1,1,0,2], m9:[0,X,0,0,0,2], m11:[0,0,0,0,0,0], "13":[0,X,0,1,2,X],
    "7b9":[0,X,0,1,0,1], "7b5":[0,X,0,1,-1,X], "7#5":[0,X,0,1,1,X],
    dim7:[0,X,-1,0,-1,X], m7b5:[0,X,0,0,-1,X], aug:[0,X,2,1,1,X],
  };
  const A_SHAPE = { // tonica sulla 5ª corda
    maj:[X,0,2,2,2,0], m:[X,0,2,2,1,0], "5":[X,0,2,2,X,X], "7":[X,0,2,0,2,0], maj7:[X,0,2,1,2,0],
    m7:[X,0,2,0,1,0], mMaj7:[X,0,2,1,1,0], "6":[X,0,2,2,2,2], m6:[X,0,2,2,1,2], "69":[X,0,-1,-1,0,0],
    sus2:[X,0,2,2,0,0], sus4:[X,0,2,2,3,0], "7sus4":[X,0,2,0,3,0], "9sus4":[X,0,0,0,0,0], "11":[X,0,0,0,0,0],
    "9":[X,0,-1,0,0,0], add9:[X,0,2,4,2,0], madd9:[X,0,2,4,1,0], maj9:[X,0,-1,1,0,X], m9:[X,0,-2,0,0,X],
    m11:[X,0,0,0,1,0], "13":[X,0,-1,0,0,2], "7b9":[X,0,-1,0,-1,X], "7#9":[X,0,-1,0,1,X],
    "7b5":[X,0,1,0,2,X], "7#5":[X,0,X,0,2,1],
    dim:[X,0,1,2,1,X], dim7:[X,0,1,2,1,2], m7b5:[X,0,1,0,1,X], aug:[X,0,3,2,2,1],
  };
  // Accordi aperti classici (preferiti quando esistono)
  const p = s => [...s].map(c=>c==="x"?X:+c);
  const OPEN = {
    "0:maj":p("x32010"), "0:7":p("x32310"), "0:maj7":p("x32000"), "0:6":p("x32210"), "0:sus2":p("x30013"), "0:sus4":p("x33011"),
    "0:add9":p("x32030"),
    "2:maj":p("xx0232"), "2:m":p("xx0231"), "2:7":p("xx0212"), "2:maj7":p("xx0222"), "2:m7":p("xx0211"),
    "2:6":p("xx0202"), "2:sus2":p("xx0230"), "2:sus4":p("xx0233"), "2:7sus4":p("xx0213"),
    "4:add9":p("024100"), "4:5":p("022xxx"),
    "7:maj":p("320003"), "7:7":p("320001"), "7:maj7":p("320002"), "7:6":p("320000"), "7:sus4":p("3x0013"), "7:add9":p("320203"),
    "5:maj7":p("xx3210"), "9:5":p("x022xx"),
  };

  function shapeAt(shape, rootStringPc, rootPc){
    let r = (rootPc - rootStringPc + 12) % 12;
    let frets = shape.map(o => o===X ? X : o + r);
    if (frets.some(f => f!==X && f<0)) { r += 12; frets = shape.map(o => o===X ? X : o + r); }
    const fr = frets.filter(f=>f!==X);
    const rootIdx = shape.findIndex(o=>o!==X);
    let barre = null;
    if (r>0 && frets[rootIdx]===Math.min(...fr)) {
      // barré dalla corda della tonica all'ultima corda suonata a quel tasto
      let last = rootIdx;
      for (let i=rootIdx;i<6;i++) if (frets[i]===r) last=i;
      if (last>rootIdx) barre = {fret:r, from:rootIdx, to:last};
    }
    return {frets, barre, max:Math.max(...fr)};
  }

  function voicings(rootPc, type){
    const out=[];
    const o = OPEN[rootPc+":"+type];
    if (o) out.push({frets:o, barre:null, max:Math.max(...o.filter(f=>f!==X)), open:true});
    if (E_SHAPE[type]) out.push(shapeAt(E_SHAPE[type], 4, rootPc));
    if (A_SHAPE[type]) out.push(shapeAt(A_SHAPE[type], 9, rootPc));
    // ordina: aperto prima, poi posizione più bassa
    out.sort((a,b)=> (b.open?1:0)-(a.open?1:0) || a.max-b.max);
    // togli doppioni
    return out.filter((v,i)=> out.findIndex(w=>w.frets.join()===v.frets.join())===i);
  }

  // Riconosce un nome di accordo (italiano o inglese)
  const ROOT_RE = /^(DO|RE|MI|FA|SOL|LA|SI|[A-G])(#|b)?/;
  const FROM_IT = {DO:"C",RE:"D",MI:"E",FA:"F",SOL:"G",LA:"A",SI:"B"};
  function pcOf(letter, acc){ return (LETTER_PC[LETTERS.indexOf(letter)] + (acc==="#"?1:acc==="b"?-1:0) + 12) % 12; }
  function parseChord(name){
    name = name.trim();
    const m = name.match(ROOT_RE); if (!m) return null;
    const letter = FROM_IT[m[1]] || m[1], acc = m[2]||"";
    let rest = name.slice(m[0].length), bass = null;
    rest = rest.replace(/^(6\/9|6add9)/, "69");
    const sl = rest.indexOf("/");
    if (sl>=0){ const bm = rest.slice(sl+1).match(ROOT_RE); if (bm) bass = (FROM_IT[bm[1]]||bm[1])+(bm[2]||""); rest = rest.slice(0,sl); }
    const r = rest.replace(/[()]/g,"").replace(/♭/g,"b").replace(/♯/g,"#");
    const M = "(m|min|-)";
    const map = [
      [/^(maj|M|Δ)?$/, "maj"], [new RegExp(`^${M}$`), "m"], [/^5$/, "5"],
      [/^6$/, "6"], [new RegExp(`^${M}6$`), "m6"], [/^69$/, "69"],
      [/^7$/, "7"], [/^(maj7|Maj7|M7|7\+|Δ7?|ma7|j7)$/, "maj7"], [new RegExp(`^${M}7$`), "m7"],
      [new RegExp(`^${M}(maj7|Maj7|M7|7\+|Δ7?)$`), "mMaj7"],
      [/^sus2$/, "sus2"], [/^sus4?$/, "sus4"], [/^7sus4?$/, "7sus4"], [/^(9sus4?|sus9)$/, "9sus4"],
      [/^(add9|add2|2)$/, "add9"], [new RegExp(`^${M}(add9|add2|2)$`), "madd9"],
      [/^9$/, "9"], [/^(maj9|Maj9|M9|Δ9)$/, "maj9"], [new RegExp(`^${M}9$`), "m9"],
      [/^11$/, "11"], [new RegExp(`^${M}11$`), "m11"], [/^13$/, "13"],
      [/^7b9$/, "7b9"], [/^7#9$/, "7#9"], [/^(7b5|7-5)$/, "7b5"], [/^(7#5|7\+5|\+7|aug7)$/, "7#5"],
      [/^(dim|°|o)$/, "dim"], [/^(dim7|°7|o7)$/, "dim7"], [new RegExp(`^(${M}7b5|${M}7-5|ø7?)$`), "m7b5"],
      [/^(aug|\+|\+5|#5)$/, "aug"],
      "APPROX",
      [/^(maj13|Maj13|M13|maj7#11|maj11)$/, "maj9"], [new RegExp(`^${M}13$`), "m9"], [/^(7#11|9#11)$/, "9"],
      [/^(13b9|7b13|7alt|alt)$/, "7b9"], [/^(7#9#5|7#5#9)$/, "7#9"], [/^add11$/, "maj"], [new RegExp(`^${M}add11$`), "m"],
    ];
    let type = null, approx = false;
    const cut = map.indexOf("APPROX");
    for (let i=0;i<map.length;i++){ if (i===cut) continue; const [re,t]=map[i]; if (re.test(r)) { type=t; approx = i>cut; break; } }
    if (!type) { approx = true; type = /^(m|min|-)(?!aj)/.test(r) ? "m" : /^(dim|°)/.test(r) ? "dim" : /^7/.test(r) ? "7" : "maj"; }
    return {root: letter+acc, rootPc: pcOf(letter,acc), type, bass, approx, original:name};
  }

  // Disegno SVG del diagramma
  function diagram(v, opt={}){
    const w=opt.width||86, sx=w/7.2, sy=sx*1.25, ox=sx*1.4, oy=sx*1.6, nfr=5;
    const fr=v.frets.filter(f=>f!==X && f>0);
    const max=Math.max(0,...fr), min=Math.min(99,...fr);
    const start = max<=5 ? 1 : min;
    const h = oy + sy*nfr + sx*0.6;
    let s=`<svg class="cf-dg" width="${w}" height="${h.toFixed(0)}" viewBox="0 0 ${w} ${h.toFixed(1)}" xmlns="http://www.w3.org/2000/svg">`;
    if (start===1) s+=`<rect x="${ox}" y="${oy-3}" width="${sx*5}" height="3.5" fill="#000"/>`;
    else s+=`<text x="${ox+sx*5+4}" y="${oy+sy*0.65}" font-size="${sx*0.85}" font-family="Arial">${start}ª</text>`;
    for(let i=0;i<6;i++) s+=`<line x1="${ox+i*sx}" y1="${oy}" x2="${ox+i*sx}" y2="${oy+sy*nfr}" stroke="#000" stroke-width="1"/>`;
    for(let j=0;j<=nfr;j++) s+=`<line x1="${ox}" y1="${oy+j*sy}" x2="${ox+sx*5}" y2="${oy+j*sy}" stroke="#000" stroke-width="1"/>`;
    const rr=sx*0.38;
    if (v.barre){ const y=oy+sy*(v.barre.fret-start+0.5);
      s+=`<rect x="${ox+v.barre.from*sx-rr}" y="${y-rr}" width="${(v.barre.to-v.barre.from)*sx+2*rr}" height="${2*rr}" rx="${rr}" fill="#000"/>`; }
    v.frets.forEach((f,i)=>{
      const x=ox+i*sx;
      if (f===X) s+=`<text x="${x}" y="${oy-sx*0.45}" font-size="${sx*0.9}" text-anchor="middle" font-family="Arial">×</text>`;
      else if (f===0) s+=`<circle cx="${x}" cy="${oy-sx*0.75}" r="${rr*0.75}" fill="none" stroke="#000" stroke-width="1"/>`;
      else if (!(v.barre && f===v.barre.fret && i>=v.barre.from && i<=v.barre.to))
        s+=`<circle cx="${x}" cy="${oy+sy*(f-start+0.5)}" r="${rr}" fill="#000"/>`;
    });
    return s+"</svg>";
  }

  // Scrittura corretta delle note di una scala (lettere consecutive)
  function spell(rootName, degrees){ // degrees: [[offsetLettera, semitoni], ...]
    const L=rootName[0], acc=rootName.slice(1);
    const li=LETTERS.indexOf(L), rpc=pcOf(L, acc==="#"?"#":acc==="b"?"b":"");
    return degrees.map(([lo,st])=>{
      const letter=LETTERS[(li+lo)%7], nat=LETTER_PC[(li+lo)%7], target=(rpc+st)%12;
      const d=((target-nat+18)%12)-6;
      const a = d===0?"":d===1?"#":d===2?"##":d===-1?"b":"bb";
      return {name:letter+a, pc:target};
    });
  }

  // accordo con basso (es. DO/SI): prova a mettere il basso su una corda grave
  const OPEN_PC=[4,9,2,7,11,4];
  function withBass(v, bassPc){
    if (!v || v.barre) return null;
    const low = v.frets.findIndex(f=>f!==X);
    if ((OPEN_PC[low]+v.frets[low])%12===bassPc) return v;
    const played = v.frets.filter(f=>f!==X && f>0); const hi = Math.max(0,...played);
    for (const i of [low-1, low, low+1]) {
      if (i<0 || i>2) continue;
      for (let f=0; f<=Math.max(4,hi+1); f++) if ((OPEN_PC[i]+f)%12===bassPc && (f===0 || hi===0 || Math.abs(f-hi)<=3)) {
        const fr = v.frets.map((x,j)=> j<i ? X : j===i ? f : x);
        return {frets:fr, barre:null, max:Math.max(...fr.filter(x=>x!==X))};
      }
    }
    return null;
  }
  function chordVoicing(name){
    const c = parseChord(name); if (!c) return null;
    const vs = voicings(c.rootPc, c.type); let v = vs[0], bassOk = false;
    if (c.bass) { const bp = pcOf(c.bass[0], c.bass.slice(1)); for (const w of vs) { const b = withBass(w, bp); if (b) { v=b; bassOk=true; break; } } }
    return {chord:c, v, bassOk};
  }

  return {chordVoicing, withBass, SHARP, FLAT, ROOTS, TYPES, TYPE, voicings, parseChord, diagram, toIt, noteName, spell, pcOf, LETTERS};
})();
