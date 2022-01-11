import React from 'react';
import './App.css';
import { buildIbans } from './mapp4';
import { createSteuerIdDigits } from './strId';

const gm = require('avris-generator');
const crypto = require('crypto');

var countriesForUmsatzID = [
  { value: 'HR', label: 'Kroatien' },
  { value: 'DK', label: 'Dänemark' },
  { value: 'FR', label: 'Frankreich' },
  { value: 'DE', label: 'Deutschland' },
  { value: 'IE', label: 'Ireland' },
  { value: 'IT', label: 'Italien' },
  { value: 'LU', label: 'Luxemburg' },
  { value: 'NL', label: 'Niederland' },
];

var countriesForIBAN = [
  { value: 'Croatia', label: 'Kroatien' },
  { value: 'Denmark', label: 'Dänemark' },
  { value: 'Germany', label: 'Deutschland' },
  { value: 'Greece', label: 'Griechenland' },
  { value: 'Ireland', label: 'Ireland' },
  { value: 'Italy', label: 'Italien' },
  { value: 'Luxembourg', label: 'Luxemburg' },
  { value: 'Switzerland', label: 'Schweiz' },
  { value: 'Turkey', label: 'Türkei' },
];

const taxOfficeNameMap = {"1010" : "Saarlouis" , "1020" : "Merzig" , "1030" : "Neunkirchen" , "1040" : "Saarbrücken Am Stadtgraben" , "1055" : "Saarbrücken MainzerStr" , "1060" : "St. Wendel" , "1070" : "Saarbrücken Am Stadtgraben - Außenst. Sulzbach" , "1075" : "Homburg" , "1085" : "Homburg - Außenst. St. Ingbert" , "1090" : "Saarbrücken Am Stadtgraben - Außenst. Völklingen" , "1113" : "Charlottenburg" , "1114" : "Friedrichshain-Kreuzberg" , "1116" : "Neukölln" , "1117" : "Reinickendorf" , "1118" : "Schöneberg" , "1119" : "Spandau" , "1120" : "Steglitz" , "1121" : "Tempelhof" , "1123" : "Wedding" , "1124" : "Wilmersdorf" , "1125" : "Zehlendorf" , "1127" : "für Körperschaften I" , "1129" : "für Körperschaften III" , "1130" : "für Körperschaften IV" , "1131" : "Prenzlauer Berg" , "1132" : "Lichtenberg" , "1133" : "Marzahn-Hellersdorf" , "1134" : "Mitte/Tiergarten" , "1135" : "Pankow/Weißensee" , "1136" : "Treptow-Köpenick" , "1137" : "für Körperschaften II" , "1138" : "für Fahndung und Strafsachen Berlin" , "1191" : "Technisches Finanzamt Berlin" , "2111" : "Bad Segeberg" , "2113" : "Elmshorn" , "2115" : "Flensburg" , "2116" : "Dithmarschen" , "2117" : "Nordfriesland" , "2118" : "Itzehoe" , "2120" : "Kiel" , "2122" : "Lübeck" , "2124" : "Neumünster" , "2125" : "Ostholstein" , "2126" : "Plön" , "2127" : "Ratzeburg" , "2128" : "Rendsburg" , "2129" : "Eckernförde-Schleswig" , "2130" : "Stormarn" , "2131" : "Pinneberg" , "2137" : "Zentrale Prüfungsdienste" , "2201" : "Hamburg für Steuererhebung in Hamburg" , "2210" : "Hamburg für Verkehrst. und Grundbesitz" , "2216" : "Hamburg für Verkehrst. und Grundbesitz" , "2217" : "Hamburg-Nord" , "2220" : "Hamburg für Verkehrst. und Grundbesitz" , "2227" : "Hamburg für Großunternehmen in Hamburg" , "2228" : "Hamburg für Prüfungsd. und Strafsachen" , "2230" : "Hamburg für Verkehrst. und Grundbesitz" , "2235" : "Hamburg für Verkehrst. und Grundbesitz" , "2241" : "Hamburg-Altona" , "2242" : "Hamburg-Am Tierpark" , "2243" : "Hamburg-Barmbek-Uhlenhorst" , "2244" : "Hamburg-Ost" , "2245" : "Hamburg-Eimsbüttel" , "2246" : "Hamburg-Hansa" , "2247" : "Hamburg-Harburg" , "2248" : "Hamburg-Mitte" , "2249" : "Hamburg-Nord" , "2250" : "Hamburg-Oberalster" , "2251" : "Hamburg-Ost" , "2313" : "Braunschweig-Altewiekring" , "2314" : "Braunschweig-Wilhelmstr." , "2315" : "Buchholz in der Nordheide" , "2316" : "Burgdorf" , "2317" : "Celle" , "2318" : "Cuxhaven" , "2319" : "Gifhorn" , "2320" : "Göttingen" , "2322" : "Hameln" , "2323" : "Hannover-Land I" , "2324" : "Hannover-Mitte" , "2325" : "Hannover-Nord" , "2326" : "Hannover-Süd" , "2327" : "Hannover-Land II" , "2328" : "Helmstedt" , "2329" : "Herzberg am Harz" , "2330" : "Hildesheim-Alfeld" , "2331" : "Holzminden" , "2333" : "Lüneburg" , "2334" : "Nienburg/Weser" , "2335" : "Northeim" , "2336" : "Osterholz-Scharmbeck" , "2338" : "Peine" , "2340" : "Rotenburg (Wümme)" , "2341" : "Soltau" , "2342" : "Hannover-Land I Außenstelle Springe" , "2343" : "Stade" , "2344" : "Stadthagen" , "2345" : "Sulingen" , "2346" : "Syke" , "2347" : "Uelzen-Lüchow" , "2348" : "Verden (Aller)" , "2349" : "Wesermünde" , "2350" : "Winsen (Luhe)" , "2351" : "Wolfenbüttel" , "2352" : "Zeven" , "2353" : "Papenburg" , "2354" : "Aurich-Wittmund" , "2355" : "Bad Bentheim" , "2356" : "Cloppenburg" , "2357" : "Delmenhorst" , "2358" : "Emden-Norden" , "2360" : "Leer (Ostfriesland)" , "2361" : "Lingen (Ems)" , "2362" : "Norden" , "2363" : "Nordenham" , "2364" : "Oldenburg (Oldenburg)" , "2365" : "Osnabrück-Land" , "2366" : "Osnabrück-Stadt" , "2367" : "Quakenbrück" , "2368" : "Vechta" , "2369" : "Westerstede" , "2370" : "Wilhelmshaven" , "2371" : "Wittmund" , "2380" : "Braunschweig für Großbetriebsprüfung" , "2382" : "Hannover für Großbetriebsprüfung" , "2384" : "Stade für Großbetriebsprüfung" , "2385" : "Oldenburg für Großbetriebsprüfung" , "2386" : "Osnabrück für Großbetriebsprüfung" , "2390" : "für Fahndung und Strafsachen Braunschweig" , "2391" : "Hannover für Fahndung und Strafsachen" , "2392" : "Lüneburg für Fahndung und Strafsachen" , "2393" : "Oldenburg für Fahndung und Strafsachen" , "2457" : "Bremerhaven Bewertung Bremen" , "2460" : "Bremen" , "2471" : "Landeshauptkasse Bremen" , "2475" : "Bremerhaven" , "2477" : "Bremerhaven Bewertung" , "2478" : "Bremen für Außenprüfung" , "2485" : "Bremerhaven Arbeitnehmerbereich" , "2601" : "Alsfeld-Lauterbach Verwaltungsstelle Alsfeld" , "2602" : "Hersfeld-Rotenburg Verwaltungsstelle Bad Hersfeld" , "2603" : "Bad Homburg vor der Höhe" , "2605" : "Bensheim" , "2606" : "Marburg-Biedenkopf Verwaltungsstelle Biedenkopf" , "2607" : "Darmstadt" , "2608" : "Dieburg" , "2609" : "Dillenburg" , "2610" : "Eschwege-Witzenhausen Verwaltungsstelle Eschwege" , "2611" : "Korbach-Frankenberg Verwaltungsstelle Frankenberg" , "2612" : "Frankfurt am Main II" , "2613" : "Frankfurt am Main I" , "2614" : "Frankfurt am Main IV" , "2615" : "Frankfurt am Main V-Höchst Verwaltungsstelle Höchst" , "2616" : "Friedberg (Hessen)" , "2617" : "Bensheim Außenstelle Fürth" , "2618" : "Fulda" , "2619" : "Gelnhausen" , "2620" : "Gießen" , "2621" : "Groß-Gerau" , "2622" : "Hanau" , "2623" : "Kassel II-Hofgeismar Verwaltungsstelle Hofgeismar" , "2624" : "Schwalm-Eder Verwaltungsstelle Fritzlar" , "2625" : "Kassel I" , "2626" : "Kassel II-Hofgeismar Verwaltungsstelle Kassel" , "2627" : "Korbach-Frankenberg Verwaltungsstelle Korbach" , "2628" : "Langen" , "2629" : "Alsfeld-Lauterbach Verwaltungsstelle Lauterbach" , "2630" : "Limburg-Weilburg Verwaltungsstelle Limburg" , "2631" : "Marburg-Biedenkopf Verwaltungsstelle Marburg" , "2632" : "Schwalm-Eder Verwaltungsstelle Melsungen" , "2633" : "Michelstadt" , "2634" : "Nidda" , "2635" : "Offenbach am Main I" , "2636" : "Hersfeld-Rotenburg Verwaltungsstelle Rotenburg" , "2637" : "Rheingau-Taunus Verwaltungsstelle Rüdesheim" , "2638" : "Limburg-Weilburg Verwaltungsstelle Weilburg" , "2639" : "Wetzlar" , "2640" : "Wiesbaden I" , "2641" : "Eschwege-Witzenhausen Verwaltungsstelle Witzenhausen" , "2642" : "Schwalm-Eder Verwaltungsstelle Schwalmstadt" , "2643" : "Wiesbaden II" , "2644" : "Offenbach am Main II" , "2645" : "Frankfurt am Main III" , "2646" : "Hofheim am Taunus" , "2701" : "Bad Neuenahr-Ahrweiler" , "2702" : "Altenkirchen-Hachenburg" , "2706" : "Bad Kreuznach" , "2708" : "Bingen-Alzey" , "2709" : "Idar-Oberstein" , "2710" : "Bitburg-Prüm" , "2713" : "Landesfinanzkasse Daun" , "2719" : "Kaiserslautern" , "2722" : "Koblenz" , "2723" : "Kusel-Landstuhl" , "2724" : "Landau" , "2726" : "Mainz" , "2727" : "Ludwigshafen" , "2729" : "Mayen" , "2730" : "Montabaur-Diez" , "2731" : "Neustadt" , "2732" : "Neuwied" , "2734" : "Kusel-Landstuhl für Erb/Schenk.St. Saarland" , "2735" : "Pirmasens" , "2740" : "Simmern-Zell" , "2741" : "Speyer-Germersheim" , "2742" : "Trier" , "2743" : "Wittlich" , "2744" : "Worms-Kirchheimbolanden" , "2801" : "Offenburg Außenstelle Achern" , "2804" : "Villingen-Schwenningen Außenstelle Donaueschingen" , "2805" : "Emmendingen" , "2806" : "Freiburg-Stadt" , "2807" : "Freiburg-Land" , "2808" : "Offenburg Außenstelle Kehl" , "2809" : "Konstanz" , "2810" : "Lahr" , "2811" : "Lörrach" , "2812" : "Müllheim" , "2813" : "Freiburg-Land Außenstelle Titisee-Neustadt" , "2814" : "Offenburg" , "2815" : "Rottweil Außenstelle Oberndorf" , "2816" : "Waldshut-Tiengen Außenstelle Bad Säckingen" , "2818" : "Singen" , "2819" : "Rottweil" , "2820" : "Waldshut-Tiengen" , "2821" : "Tuttlingen" , "2822" : "Villingen-Schwenningen" , "2823" : "Offenburg Außenstelle Wolfach" , "2830" : "Bruchsal" , "2831" : "Ettlingen" , "2832" : "Heidelberg" , "2833" : "Baden-Baden" , "2834" : "Karlsruhe-Durlach" , "2835" : "Karlsruhe-Stadt" , "2836" : "Baden-Baden Außenstelle Bühl" , "2837" : "Mannheim-Neckarstadt" , "2838" : "Mannheim-Stadt" , "2839" : "Rastatt" , "2840" : "Mosbach" , "2841" : "Pforzheim" , "2842" : "Freudenstadt" , "2843" : "Schwetzingen" , "2844" : "Sinsheim" , "2845" : "Calw" , "2846" : "Mosbach Außenstelle Walldürn" , "2847" : "Weinheim" , "2848" : "Mühlacker" , "2849" : "Pforzheim Außenstelle Neuenbürg" , "2850" : "Aalen" , "2851" : "Backnang" , "2852" : "Tauberbischofsheim Außenstelle Bad Mergentheim" , "2853" : "Balingen" , "2854" : "Biberach" , "2855" : "Bietigheim-Bissingen" , "2856" : "Böblingen" , "2857" : "Schwäbisch Hall Außenstelle Crailsheim" , "2858" : "Ehingen" , "2859" : "Esslingen" , "2861" : "Friedrichshafen" , "2862" : "Göppingen Außenstelle Geislingen" , "2863" : "Göppingen" , "2864" : "Heidenheim" , "2865" : "Heilbronn" , "2869" : "Nürtingen Außenstelle Kirchheim" , "2870" : "Leonberg" , "2871" : "Ludwigsburg" , "2874" : "Nürtingen" , "2876" : "Öhringen" , "2877" : "Ravensburg" , "2878" : "Reutlingen" , "2879" : "Biberach Außenstelle Riedlingen" , "2880" : "Tauberbischofsheim" , "2881" : "Sigmaringen Außenstelle Bad Saulgau" , "2882" : "Schorndorf" , "2883" : "Schwäbisch Gmünd" , "2884" : "Schwäbisch Hall" , "2885" : "Sigmaringen" , "2886" : "Tübingen" , "2887" : "Überlingen (Bodensee)" , "2888" : "Ulm" , "2889" : "Bad Urach" , "2890" : "Waiblingen" , "2891" : "Wangen" , "2892" : "Stuttgart IV" , "2893" : "Stuttgart I" , "2895" : "Stuttgart II" , "2896" : "Stuttgart Zentrales Konzernprüfungsamt" , "2897" : "Stuttgart III" , "2899" : "Stuttgart-Körpersch." , "3046" : "Potsdam" , "3048" : "Brandenburg" , "3049" : "Königs Wusterhausen" , "3050" : "Luckenwalde" , "3051" : "Nauen" , "3052" : "Kyritz" , "3053" : "Oranienburg" , "3056" : "Cottbus" , "3057" : "Calau" , "3061" : "Frankfurt (Oder)" , "3062" : "Angermünde" , "3064" : "Strausberg" , "3065" : "Eberswalde" , "3102" : "Magdeburg" , "3103" : "Genthin" , "3105" : "Haldensleben" , "3106" : "Salzwedel" , "3107" : "Staßfurt" , "3108" : "Stendal" , "3110" : "Halle (Saale)" , "3112" : "Merseburg" , "3114" : "Dessau-Roßlau" , "3115" : "Wittenberg" , "3116" : "Bitterfeld-Wolfen" , "3117" : "Quedlinburg" , "3118" : "Eisleben" , "3119" : "Naumburg" , "3202" : "Dresden-Nord" , "3203" : "Dresden-Süd" , "3204" : "Bautzen" , "3207" : "Görlitz" , "3208" : "Löbau" , "3209" : "Meißen" , "3210" : "Pirna" , "3213" : "Hoyerswerda" , "3214" : "Chemnitz-Süd" , "3215" : "Chemnitz-Mitte" , "3217" : "Annaberg" , "3218" : "Schwarzenberg" , "3220" : "Freiberg" , "3222" : "Mittweida" , "3223" : "Plauen" , "3224" : "Stollberg" , "3227" : "Zwickau" , "3228" : "Zschopau" , "3231" : "Leipzig II" , "3232" : "Leipzig I" , "3236" : "Döbeln" , "3237" : "Eilenburg" , "3238" : "Grimma" , "3239" : "Oschatz" , "4069" : "Neubrandenburg - RAB" , "4070" : "Neubrandenburg - RIA (Rentenempfänger im Ausland)" , "4072" : "Neubrandenburg" , "4075" : "Waren" , "4079" : "Rostock" , "4080" : "Wismar" , "4081" : "Ribnitz-Damgarten" , "4082" : "Stralsund" , "4084" : "Greifswald" , "4086" : "Güstrow" , "4087" : "Hagenow" , "4090" : "Schwerin" , "4151" : "Erfurt" , "4154" : "Ilmenau" , "4155" : "Eisenach" , "4156" : "Gotha" , "4157" : "Mühlhausen" , "4159" : "Sondershausen" , "4161" : "Gera" , "4162" : "Jena" , "4165" : "Pößneck" , "4166" : "Altenburg" , "4170" : "Sonneberg" , "4171" : "Suhl" , "5101" : "Dinslaken" , "5102" : "Viersen" , "5103" : "Düsseldorf-Altstadt" , "5105" : "Düsseldorf-Nord" , "5106" : "Düsseldorf-Süd" , "5107" : "Duisburg-Hamborn" , "5109" : "Duisburg-Süd" , "5111" : "Essen-NordOst" , "5112" : "Essen-Süd" , "5113" : "Geldern" , "5114" : "Grevenbroich" , "5115" : "Kempen" , "5116" : "Kleve" , "5117" : "Krefeld" , "5119" : "Kamp-Lintfort" , "5120" : "Mülheim an der Ruhr" , "5121" : "Mönchengladbach" , "5122" : "Neuss" , "5123" : "Oberhausen-Nord" , "5124" : "Oberhausen-Süd" , "5126" : "Remscheid" , "5128" : "Solingen" , "5130" : "Wesel" , "5131" : "Wuppertal-Barmen" , "5132" : "Wuppertal-Elberfeld" , "5133" : "Düsseldorf-Mitte" , "5134" : "Duisburg-West" , "5135" : "Hilden" , "5139" : "Velbert" , "5147" : "Düsseldorf-Mettmann" , "5149" : "Rechenzentrum d. FinVerw NRW" , "5170" : "Düsseldorf I für Groß- und Konzernbetriebsprüfung" , "5171" : "Düsseldorf II für Groß- und Konzernbetriebsprüfung" , "5172" : "Essen für Groß- und Konzernbetriebsprüfung" , "5173" : "Krefeld für Groß- und Konzernbetriebsprüfung" , "5174" : "Bergisches Land für Groß- und Konzernbetriebsprüfung" , "5176" : "Mönchengladbach für Groß- und Konzernbetriebsprüfung" , "5181" : "Düsseldorf f. Steuerfahndung und Steuerstrafsachen" , "5182" : "Essen f. Steuerfahndung und Steuerstrafsachen" , "5183" : "Wuppertal f. Steuerfahndung und Steuerstrafsachen" , "5201" : "Aachen-Stadt" , "5202" : "Aachen-Kreis" , "5203" : "Bergheim" , "5204" : "Bergisch Gladbach" , "5205" : "Bonn-Innenstadt" , "5206" : "Bonn-Außenstadt" , "5207" : "Düren" , "5208" : "Erkelenz" , "5209" : "Euskirchen" , "5210" : "Geilenkirchen" , "5211" : "Schleiden" , "5212" : "Gummersbach" , "5213" : "Jülich" , "5214" : "Köln-Altstadt" , "5215" : "Köln-Mitte" , "5216" : "Köln-Porz" , "5217" : "Köln-Nord" , "5218" : "Köln-Ost" , "5219" : "Köln-Süd" , "5220" : "Siegburg" , "5221" : "Wipperfürth" , "5222" : "Sankt Augustin" , "5223" : "Köln-West" , "5224" : "Brühl" , "5230" : "Leverkusen" , "5270" : "Köln für Groß- und Konzernbetriebsprüfung" , "5271" : "Aachen für Groß- und Konzernbetriebsprüfung" , "5272" : "Bonn für Groß- und Konzernbetriebsprüfung" , "5281" : "Aachen f. Steuerfahndung und Steuerstrafsachen" , "5282" : "Bonn f. Steuerfahndung und Steuerstrafsachen" , "5283" : "Köln f. Steuerfahndung und Steuerstrafsachen" , "5301" : "Ahaus" , "5302" : "Altena" , "5303" : "Arnsberg" , "5304" : "Beckum" , "5305" : "Bielefeld-Innenstadt" , "5306" : "Bochum-Mitte" , "5307" : "Borken" , "5308" : "Bottrop" , "5309" : "Brilon" , "5310" : "Bünde" , "5311" : "Steinfurt" , "5312" : "Coesfeld" , "5313" : "Detmold" , "5314" : "Dortmund-West" , "5315" : "Dortmund-Hörde" , "5316" : "Dortmund-Unna" , "5317" : "Dortmund-Ost" , "5319" : "Gelsenkirchen" , "5321" : "Hagen" , "5322" : "Hamm" , "5323" : "Hattingen" , "5324" : "Herford" , "5325" : "Herne" , "5326" : "Höxter" , "5327" : "Ibbenbüren" , "5328" : "Iserlohn" , "5329" : "Lemgo" , "5330" : "Lippstadt" , "5331" : "Lübbecke" , "5332" : "Lüdenscheid" , "5333" : "Lüdinghausen" , "5334" : "Meschede" , "5335" : "Minden" , "5336" : "Münster-Außenstadt" , "5337" : "Münster-Innenstadt" , "5338" : "Olpe" , "5339" : "Paderborn" , "5340" : "Recklinghausen" , "5341" : "Schwelm" , "5342" : "Siegen" , "5343" : "Soest" , "5345" : "Warburg" , "5346" : "Warendorf" , "5347" : "Wiedenbrück" , "5348" : "Witten" , "5349" : "Bielefeld-Außenstadt" , "5350" : "Bochum-Süd" , "5351" : "Gütersloh" , "5359" : "Marl" , "5371" : "Bielefeld für Groß- und Konzernbetriebsprüfung" , "5372" : "Herne für Groß- und Konzernbetriebsprüfung" , "5373" : "Detmold für Groß- und Konzernbetriebsprüfung" , "5374" : "Dortmund für Groß- und Konzernbetriebsprüfung" , "5375" : "Hagen für Groß- und Konzernbetriebsprüfung" , "5376" : "Münster für Groß- und Konzernbetriebsprüfung" , "5381" : "Bielefeld f. Steuerfahndung und Steuerstrafsachen" , "5382" : "Bochum f. Steuerfahndung und Steuerstrafsachen" , "5383" : "Hagen f. Steuerfahndung und Steuerstrafsachen" , "5384" : "Münster f. Steuerfahndung und Steuerstrafsachen" , "9101" : "Augsburg-Stadt Arbeitnehmerbereich" , "9102" : "Augsburg-Land", "9103" : "Augsburg-Stadt" , "9104" : "Wolfratshausen - Bad Tölz" , "9105" : "Berchtesgaden-Laufen" , "9106" : "Burghausen" , "9107" : "Dachau" , "9108" : "Deggendorf" , "9109" : "Dillingen" , "9110" : "Dingolfing" , "9111" : "Nördlingen mit ASt Donauwörth" , "9112" : "Ebersberg" , "9113" : "Eggenfelden" , "9114" : "Erding" , "9115" : "Freising" , "9116" : "Bundeszentralamt für Steuern" , "9117" : "Fürstenfeldbruck" , "9119" : "Garmisch-Partenkirchen" , "9121" : "Günzburg" , "9123" : "Kempten-Immenstadt" , "9124" : "Ingolstadt" , "9125" : "Kaufbeuren m. ASt Füssen" , "9126" : "Kelheim" , "9127" : "Kempten-Immenstadt" , "9131" : "Landsberg am Lech" , "9132" : "Landshut" , "9134" : "Lindau" , "9138" : "Memmingen-Mindelheim" , "9139" : "Miesbach" , "9140" : "Memmingen-Mindelheim" , "9141" : "Mühldorf" , "9142" : "München Bewertung des Grundbesitzes" , "9143" : "München Körperschaften/PersonenGesellschaften" , "9144" : "München Gewinneinkünfte" , "9145" : "München Gewinneinkünfte" , "9146" : "München Gewinneinkünfte" , "9147" : "München Gewinneinkünfte" , "9148" : "München Gewinneinkünfte" , "9149" : "München Erhebung" , "9151" : "Neu-Ulm" , "9152" : "Nördlingen mit ASt Donauwörth" , "9153" : "Passau mit Außenstellen" , "9154" : "Pfaffenhofen" , "9156" : "Rosenheim m. ASt Wasserburg" , "9157" : "Grafenau" , "9159" : "Schrobenhausen m. ASt Neuburg" , "9161" : "Starnberg" , "9162" : "Straubing" , "9163" : "Traunstein" , "9168" : "Weilheim-Schongau" , "9169" : "Wolfratshausen - Bad Tölz" , "9170" : "Zwiesel m. ASt Viechtach" , "9171" : "Eichstätt" , "9181" : "München Überschusseinkünfte" , "9182" : "München Überschusseinkünfte u. Beschränkt Steuerpfl." , "9183" : "München Überschusseinkünfte" , "9184" : "München Überschusseinkünfte" , "9185" : "München Überschusseinkünfte" , "9187" : "München Körperschaften" , "9188" : "München Betriebsprüfung" , "9189" : "München Erhebung" , "9201" : "Amberg" , "9202" : "Obernburg am Main mit Außenstelle Amorbach" , "9203" : "Ansbach mit Außenstellen" , "9204" : "Aschaffenburg" , "9205" : "Bad Kissingen" , "9206" : "Bad Neustadt a.d.S." , "9207" : "Bamberg" , "9208" : "Bayreuth" , "9211" : "Cham mit Außenstelle Bad Kötzting" , "9212" : "Coburg" , "9216" : "Erlangen" , "9217" : "Forchheim" , "9218" : "Fürth" , "9220" : "Gunzenhausen" , "9221" : "Hersbruck" , "9222" : "Hilpoltstein" , "9223" : "Hof mit Außenstellen" , "9227" : "Kitzingen" , "9228" : "Kronach" , "9229" : "Kulmbach" , "9230" : "Lichtenfels" , "9231" : "Lohr a. Main mit Außenstellen" , "9235" : "Neumarkt i.d.Opf." , "9238" : "Nürnberg-Nord" , "9240" : "Nürnberg-Süd" , "9241" : "Nürnberg-Zentral" , "9244" : "Regensburg" , "9247" : "Schwabach" , "9248" : "Schwandorf mit Außenstelle Neunburg v. W." , "9249" : "Schweinfurt" , "9252" : "Uffenheim" , "9254" : "Waldsassen" , "9255" : "Weiden i.d.Opf." , "9257" : "Würzburg mit Außenstelle Ochsenfurt" , "9258" : "Wunsiedel mit Außenstelle Selb" , "9259" : "Zeil am Main mit Außenstelle Ebern" , "2647" : "Frankfurt/M. V-Höchst Verwaltungsstelle Höchst" , "2718" : "Altenkirchen-Hachenburg Aussenstelle Hachenburg" , "2604" : "Rheingau-Taunus Verwaltungsst. Bad Schwalbach" , "2736" : "Bitburg-Prüm Aussenstelle Prüm" , "2714" : "Montabaur-Diez Aussenstelle Diez" , "2312" : "Bad Gandersheim" , "2745" : "Simmern-Zell Aussenstelle Zell" , "2725" : "Kusel-Landstuhl Aussenstelle Landstuhl" , "2321" : "Goslar" , "9232" : "Lohr a. Main mit Außenstellen ‚ Grunderwerbsteuer" , "2381" : "Gttingen für Großbetriebsprüfung" , "2171" : "Bad Segeberg Bewertung für Grundsteuer 71" , "2173" : "Elmshorn Bewertung für Grundsteuer 73" , "2175" : "Flensburg Bewertung für Grundsteuer 75" , "2190" : "Stormarn Bewertung für Grundsteuer 90" , "2184" : "Neumünster Bewertung für Grundsteuer 84" , "2186" : "Plön Bewertung für Grundsteuer 86" , "2189" : "Eckernförde-Schleswig Bewertung für Grundsteuer 89" , "2191" : "Pinneberg Bewertung für Grundsteuer 91" , "2187" : "Ratzeburg Bewertung für Grundsteuer 87" , "2172" : "Eckernförde-Schleswig Bewertung fur Grundsteuer 72" , "2183" : "Dithmarschen Bewertung für Grundsteuer 83" , "2180" : "Kiel Bewertung für Grundsteuer 80" , "2188" : "Rendsburg Bewertung für Grundsteuer 88" , "2179" : "Kiel Bewertung für Grundsteuer 79" , "2182" : "Lübeck Bewertung für Grundsteuer 82" , "2185" : "Ostholstein Bewertung für Grundsteuer 85" , "2176" : "Dithmarschen Bewertung für Grundsteuer 76" , "2177" : "Nordfriesland Bewertung für Grundsteuer 77" , "2178" : "Itzehoe Bewertung für Grundsteuer 78" , "2181" : "Nordfriesland Bewertung für Grundsteuer 81"}

const taxOfficeNumberFederalStateMapping = {
  'BW' : new Set(["2801","2804","2805","2806","2807","2808","2809","2810","2811","2812","2813","2814","2815","2816","2818","2819","2820","2821","2822","2823","2830","2831","2832","2833","2834","2835","2836","2837","2838","2839","2840","2841","2842","2843","2844","2845","2846","2847","2848","2849","2850","2851","2852","2853","2854","2855","2856","2857","2858","2859","2861","2862","2863","2864","2865","2869","2870","2871","2874","2876","2877","2878","2879","2880","2881","2882","2883","2884","2885","2886","2887","2888","2889","2890","2891","2892","2893","2895","2896","2897","2899"]),
  'BY' : new Set(["9101","9102","9102","9103","9104","9105","9106","9107","9108","9109","9110","9111","9112","9113","9114","9115","9116","9117","9119","9121","9123","9124","9125","9126","9127","9131","9132","9134","9138","9139","9140","9141","9142","9143","9143","9144","9145","9146","9147","9148","9149","9151","9152","9153","9154","9156","9157","9159","9161","9162","9163","9168","9169","9170","9171","9181","9182","9183","9184","9185","9187","9188","9189","9201","9202","9203","9204","9205","9206","9207","9208","9211","9211","9212","9216","9217","9218","9220","9221","9222","9223","9227","9228","9229","9230","9231","9232","9232","9232","9235","9238","9240","9241","9244","9247","9248","9249","9252","9254","9255","9257","9258","9259"]),
  'BE' : new Set(["1113","1114","1116","1117","1118","1119","1120","1121","1123","1124","1125","1127","1129","1130","1131","1132","1133","1134","1135","1136","1137","1138","1191"]),
  'BB' : new Set(["3046","3048","3049","3050","3051","3052","3053","3056","3057","3061","3062","3064","3065"]),
  'HB' : new Set(["2457","2460","2471","2475","2477","2478","2485"]),
  'HH' : new Set(["2201","2210","2216","2217","2220","2227","2228","2230","2235","2241","2242","2243","2244","2244","2245","2246","2247","2248","2249","2250","2251"]),
  'HE' : new Set(["2601","2602","2603","2604","2604","2605","2606","2607","2608","2609","2610","2611","2612","2613","2614","2615","2616","2617","2618","2619","2620","2621","2622","2623","2624","2625","2626","2627","2628","2629","2630","2631","2632","2633","2634","2635","2636","2637","2638","2639","2640","2641","2642","2643","2644","2645","2646","2647","2647"]),
  'MV' : new Set(["4069","4070","4072","4075","4079","4080","4081","4082","4084","4086","4087","4090"]),
  'NI' : new Set(["2312","2313","2314","2315","2316","2317","2318","2319","2320","2321","2321","2322","2323","2324","2325","2326","2327","2328","2329","2330","2331","2333","2334","2335","2336","2338","2340","2341","2342","2343","2344","2345","2346","2347","2348","2349","2350","2351","2352","2353","2354","2354","2355","2356","2357","2358","2358","2360","2361","2362","2363","2364","2365","2366","2367","2368","2369","2370","2371","2380","2381","2381","2382","2384","2385","2386","2390","2391","2392","2393"]),
  'NW' : new Set(["5101","5102","5103","5105","5106","5107","5109","5111","5112","5113","5114","5115","5116","5117","5119","5120","5121","5122","5123","5124","5126","5128","5130","5131","5132","5133","5134","5135","5139","5147","5149","5170","5171","5172","5173","5174","5176","5181","5182","5183","5201","5202","5203","5204","5205","5206","5207","5208","5209","5210","5211","5212","5213","5214","5215","5216","5217","5218","5219","5220","5221","5222","5223","5224","5230","5270","5271","5272","5281","5282","5283","5301","5302","5303","5304","5305","5306","5307","5308","5309","5310","5311","5312","5313","5314","5315","5316","5317","5319","5321","5322","5323","5324","5325","5326","5327","5328","5329","5330","5331","5332","5333","5334","5335","5336","5337","5338","5339","5340","5341","5342","5343","5345","5346","5347","5348","5349","5350","5351","5359","5371","5372","5373","5374","5375","5376","5381","5382","5383","5384"]),
  'RP' : new Set(["2701","2702","2706","2708","2709","2710","2713","2714","2718","2719","2722","2723","2724","2725","2726","2727","2729","2730","2731","2732","2734","2735","2736","2740","2741","2742","2743","2744","2745"]),
  'SL' : new Set(["1010","1020","1030","1040","1055","1060","1070","1075","1085","1090"]),
  'SN' : new Set(["3202","3203","3204","3207","3208","3209","3210","3213","3214","3215","3217","3218","3220","3222","3223","3224","3227","3228","3231","3232","3236","3237","3238","3239"]),
  'ST' : new Set(["3102","3103","3105","3106","3107","3108","3110","3112","3114","3115","3116","3117","3118","3119"]),
  'SH' : new Set(["2111","2113","2115","2116","2117","2118","2120","2122","2124","2125","2126","2127","2128","2129","2130","2131","2137","2171","2172","2173","2175","2176","2177","2178","2179","2180","2181","2182","2183","2184","2185","2186","2187","2188","2189","2190","2191"]),
  'TH' : new Set(["4151","4154","4155","4156","4157","4159","4161","4162","4165","4166","4170","4171"])
}

const allTaxOfficeNumbers = new Set(Object.values(taxOfficeNumberFederalStateMapping).reduce((pv, cv) => Array.isArray(pv) ? pv.concat(Array.from(cv)) : [].concat(Array.from(cv))));

function buildValidTaxnumber(bl) {
  var counter = 0;
  const isAll = bl === 'Alle Bundesländer';
  while (true) {
    counter++;
    if (isAll) {
      const stnr = gm.generate('DE', 'stnr');
      const taxOfficeNumber = stnr.substring(0,4);
      if (allTaxOfficeNumbers.has(taxOfficeNumber)) {
        return { "stnr" : stnr, "taxOfficeName" : taxOfficeNameMap[taxOfficeNumber]};
      }
    } else {
      const stnr = gm.generate('DE', 'stnr', { state: bl })
      const taxOfficeNumber = stnr.substring(0,4);
      if (taxOfficeNumberFederalStateMapping[bl].has(taxOfficeNumber)) {
        return { "stnr" : stnr, "taxOfficeName" : taxOfficeNameMap[taxOfficeNumber]};
      }
    }
    if (counter >= 1000) {
      return "error";
    }
  }
}

function buildUSTID(country) {
  const countryEntry = countriesForUmsatzID.find(obj => obj.label === country);
  var num = Math.random().toString().slice(2,11);
  while(num.toString().length < 9 || num.toString().charAt(0) === '0'){
    num =  Math.random().toString().slice(2,11);
  }
  return countryEntry.value + num;
}

class App extends React.Component {

  constructor(props) {
    super(props);
    const newIban = buildIbans('Germany');
    const sha256Iban = crypto.createHash('sha256').update(newIban).digest('hex')

    let taxData = buildValidTaxnumber('Alle Bundesländer');

    this.state = {
      country: 'Germany',
      iban: newIban,
      taxIDNumber: createSteuerIdDigits(),
      bundesland: 'Alle Bundesländer',
      taxNumber: taxData.stnr,
      taxOffice: taxData.taxOfficeName,
      ustIDCountry: 'Deutschland',
      ustID: buildUSTID('Deutschland'),
      shaIban: sha256Iban,
    };

    this.bundeslandHandlerTaxNum = this.bundeslandHandlerTaxNum.bind(this);
    this.handleSubmitTaxNum = this.handleSubmitTaxNum.bind(this);
    this.handleSubmitTaxID = this.handleSubmitTaxID.bind(this);
    this.countryHandler = this.countryHandler.bind(this);
    this.handleSubmitIBAN = this.handleSubmitIBAN.bind(this);
    this.generateAllValues = this.generateAllValues.bind(this);
    this.handleSubmitUstID = this.handleSubmitUstID.bind(this);
    this.handleOnChangeUstID = this.handleOnChangeUstID.bind(this);
  }

  bundeslandHandlerTaxNum(e) {
    const bl = e.target.value === "all" ? 'Alle Bundesländer' : e.target.value
    let taxData = buildValidTaxnumber(bl);
    this.setState({ bundesland: bl , taxNumber: taxData.stnr, taxOffice: taxData.taxOfficeName});
    e.preventDefault();
  };
  handleSubmitTaxNum(e) {
    var bl = this.state.bundesland;
    let taxData = buildValidTaxnumber(bl);
    this.setState({ taxNumber: taxData.stnr, taxOffice: taxData.taxOfficeName });
    e.preventDefault();
  }
  handleSubmitTaxID(e) {
    this.setState({ taxIDNumber: createSteuerIdDigits() });
    e.preventDefault();
  }

  countryHandler(e) {
    const target = e.target;
    const value = target.value;
    const newIban = buildIbans(value);
    const sha256_hash =  crypto.createHash('sha256').update(newIban).digest('hex');
    this.setState({
      country: value,
      iban: newIban,
      shaIban : sha256_hash,
    });
    e.preventDefault();
  };

  handleSubmitIBAN(e) {
    const newIban = buildIbans(this.state.country)
    const sha256_hash =  crypto.createHash('sha256').update(newIban).digest('hex');
    this.setState({
      iban: newIban,
      shaIban: sha256_hash,
    });
    e.preventDefault();
  }

  generateAllValues(e) {
    var bl = this.state.bundesland;
    const num = buildUSTID(this.state.ustIDCountry);
    const newIban = buildIbans(this.state.country)
    const sha256_hash =  crypto.createHash('sha256').update(newIban).digest('hex');
    console.log("sha256_hash", sha256_hash);
    let taxData = buildValidTaxnumber(bl);
    this.setState({
      taxIDNumber: createSteuerIdDigits(),
      taxNumber: taxData.stnr,
      taxOffice: taxData.taxOfficeName,
      iban: newIban,
      ustID: num,
      shaIban: sha256_hash
    });

  }

  handleOnChangeUstID(e) {
    const num = buildUSTID(e.target.value);

    this.setState({
      ustID: num,
      ustIDCountry: e.target.value
    });
    e.preventDefault();
  }
  handleSubmitUstID(e) {

    const num = buildUSTID(this.state.ustIDCountry);
    this.setState({
      ustID: num,
    });

    e.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <header >
          <h1>Generator for VAT ID, Tax ID, Tax Number and IBAN </h1>
        </header>

        <div>

          <form>
            <label className="label">Vat ID: &#160;</label>
            <input type="text" className="todo-input" disabled value={this.state.ustID} />
            <p>&#160;</p>
            <div className="select">

              <select value={this.state.ustIDCountry} className="filter-todo" name="ustid" onChange={this.handleOnChangeUstID}>
                {countriesForUmsatzID.map((option) => (
                  <option key={option.value} value={option.label}>{option.label}</option>
                ))}
              </select>

            </div>
            <button onClick={this.handleSubmitUstID} className="todo-button">
              <i className="fas fa-random"></i>
            </button>
          </form>
        </div>

        <div>
          <div className="mybutton">

          </div>
          <form>
            <label className="label">Tax ID: &#160;</label>
            <input type="text" className="inputResize" disabled value={this.state.taxIDNumber} />
            <p>&#160;</p>
            <button onClick={this.handleSubmitTaxID} className="todo-button">
              <i className="fas fa-random"></i>
            </button>
          </form>
        </div>

        <div>

          <form>
            <div>
              <div>
              <label className="label">Tax Nr: &#160;</label>
              <input type="text" className="todo-input" disabled value={this.state.taxNumber} />

                </div>
              <div>
              <label className="label">Office: &#160;&#160;</label>
              <input type="text" className="todo-input" disabled value={this.state.taxOffice} />
                </div>
            </div>
            <div className="select">
              <select name="state" onChange={this.bundeslandHandlerTaxNum} className="filter-todo">
                <option key="0" value="all">Alle Bundesländer</option>
                <option key="1" value="BW">Baden-Württemberg</option>
                <option key="2" value="BY">Bayern</option>
                <option key="3" value="BE">Berlin</option>
                <option key="4" value="BB">Brandenburg</option>
                <option key="5" value="HB">Bremen</option>
                <option key="6" value="HH">Hamburg</option>
                <option key="7" value="HE">Hessen</option>
                <option key="8" value="MV">Mecklenburg-Vorponnern</option>
                <option key="9" value="NI">Niedersachsen</option>
                <option key="10" value="NW">Nordrhein-Westfalen</option>
                <option key="11" value="RP">Rheinland-Pfalz</option>
                <option key="12" value="SL">Saarland</option>
                <option key="13" value="SN">Sachsen</option>
                <option key="14" value="ST">Sachsen-Anhalt</option>
                <option key="15" value="SH">Schleswig-Holstein</option>
                <option key="16" value="TH">Thüringen</option>
              </select>
            </div>

            <button onClick={this.handleSubmitTaxNum} className="todo-button">
              <i className="fas fa-random"></i>
            </button>

          </form>


        </div>

        <div>
          <form>
            <label className="label">Ibans : &#160;</label>
            <input type="text" className="todo-input" disabled value={this.state.iban} />
            <div className="select">

              <select value={this.state.country} className="filter-todo" name="iban" onChange={this.countryHandler}>
                {countriesForIBAN.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

            </div>
            <button onClick={this.handleSubmitIBAN} className="todo-button">
              <i className="fas fa-random"></i>
            </button>
          </form>
        </div>

        <div>
          <center>
            <label className="label">SHA256 hash code for iban : &#160;</label>
          </center>
          <form>
            
            <input type="text" className="label_SHA" disabled value={this.state.shaIban} />
            
          </form>
        </div>


        <center>
          <div>
            <button  id="generatorAll" onClick={this.generateAllValues} className="buttontest">
            <i className="fas fa-random"></i> Generate 
            </button>
          </div>
          
        </center>
      </div>
    );
  }
}

export default App;

