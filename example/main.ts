import { Color, Plane, PlaneHelper, Vector3} from 'three';
import { PointCloudOctree } from '../src';
import { IClipPolyhedron } from '../src/materials/clipping';
import { PointOpacityType, PointShape, PointSizeType, PointColorType } from '../src/materials/enums';
import { Viewer } from './viewer';
import { gsToPath } from '../src/utils/utils';
// import { Potree } from '../src/potree'
// @ts-ignore

const JSON5 = require('json5');

// @ts-ignore
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

require('./main.css');

let gui: GUI;

enum DemoPotree {
  LION = 0,
  YBF = 1,
  RESONAI_POTREE = 2
}

const parameters = {
  budget: 3e7,
  maxLevel: 20,
  minNodePixelSize: 40,
  'points size': 0.2,
  'clipping plane': -100,
  shape: PointShape.SQUARE,
  highlightIgnoreDepth: false,
  pointSizeType: PointSizeType.ATTENUATED,
  pointColorType: PointColorType.RGB,
  pointOpacityType: PointOpacityType.FIXED,
  demoPotree: DemoPotree.RESONAI_POTREE
};

const targetEl = document.createElement('div');
targetEl.className = 'container';
// targetEl.style.width = '400px';
// targetEl.style.height = '600px';
// targetEl.style.top = '200px';
// targetEl.style.left = '300px';
// targetEl.style.position = 'absolute';
document.body.appendChild(targetEl);

const viewer = new Viewer();
viewer.initialize(targetEl);


const clippingPlane = new Plane();
const planeHelper = new PlaneHelper(clippingPlane, 5, 0xffc919);
clippingPlane.constant = -parameters['clipping plane'];
viewer.scene.add(planeHelper);

let pointClouds: PointCloudOctree[] = [];

const onPCOLoad = (pco: PointCloudOctree, quat: number[], translation: number[]) => {
  pointClouds.push(pco);
  pco.maxLevel = parameters.maxLevel;
  pco.minNodePixelSize = parameters.minNodePixelSize;
  pco.potree.pointBudget = parameters.budget;
  pco.potree.maxNumNodesLoading = 8;
  // pointCloud.rotateX(-Math.PI / 2);
  pco.material.size = parameters['points size'];
  pco.material.pointOpacityType = parameters.pointOpacityType;
  pco.material.shape = parameters.shape;
  pco.material.setHighlightIgnoreDepth(parameters.highlightIgnoreDepth);
  pco.material.pointSizeType = parameters.pointSizeType;
  pco.material.pointColorType = parameters.pointColorType;
  pco.material.clippingPlanes = [clippingPlane];
  var quatTuple: [number, number, number, number] = [quat[0], quat[1], quat[2], quat[3]]
  var translationTuple: [number, number, number] = [translation[0], translation[1], translation[2]]
  pco.position.set(...translationTuple)
  pco.quaternion.set(...quatTuple)
  // pco.position.set(-4.943994811749849, 19.994607104408757, -18.05086635769811);
  // pco.quaternion.set(0.0040494408101606535, 0.9865631369397857, -0.0012931641867331405, 0.1633251560141326);

  // pointCloud.material.setClipPolyhedra([{
    pco.material.setHighlightPolyhedra([{
    outside: false,
    color: new Color(0xffff00),
    convexes: [{
     planes: [
       new Plane(new Vector3(-0.23640714656581407, -0.65759338107618, -0.7153199327695319), 5.982078455274273),
       new Plane(new Vector3(-0.6694967441207063, -0.7385242730936087, -0.07972457377327555), 3.6523286782910587),
       new Plane(new Vector3(0.49628440624014875, 0.6848974916633837, 0.5334952802378559), -3.511509247643808),
      ]
    },
    {
      planes: [
        new Plane(new Vector3(-0.6475844802133526, -0.5347307669341604, 0.5428603392041147), 2.481919875324591),
        new Plane(new Vector3(0.6694967441207063, 0.7385242730936087, 0.07972457377327552), -3.6523286782910587),
        new Plane(new Vector3(0.5816752160508767, 0.1388228158752384, -0.8014874726560831), 2.7728004709760365),
       ]
     }]
  }] as IClipPolyhedron[]);
  viewer.add(pco);
}

const sps = [
  // { // old
  //   loc: 'gs://resonai-irocket-public/17555/potree_ybf/S6P/loc.json',
  //   json: 'gs://resonai-irocket-public/17555/potree_structure_files/S6P/r.json'
  // },
  {
    quat: [-0.001987389224351701,-0.8330028085381739,0.0025734836373915294,0.5532592054658595],
    translation: [-4.213512295408816,9.054503202126678,-19.100652281601143],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S0P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S0P/r.json"
  },
  {
    quat: [-0.0005619622742004708,-0.7588635714252792,0.0022115557991043747,0.6512456319870821],
    translation: [-3.712406367427448,9.07025288568736,-17.394588271914188],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S1P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S1P/r.json"
  },
  {
    quat: [0.001965916020699736,-0.640033484607582,0.002322605147487616,0.7683409915271016],
    translation: [-4.213125199307012,9.077470942160534,-15.562174642586172],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S2P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S2P/r.json"
  },
  {
    quat: [0.003684690386142022,-0.8022445390886858,0.003985377250807029,0.5969708865027458],
    translation: [-4.479891322415741,9.07302059532004,-13.12200454404408],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S3P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S3P/r.json"
  },
  {
    quat: [0.0024039917287527203,-0.12859517162169756,-0.0034986813065318563,0.9916880869953278],
    translation: [-4.153695260807569,9.130221383643566,-12.205002994658287],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S4P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S4P/r.json"
  },
  {
    quat: [0.0018984125897237786,0.9157538397442144,0.001060637522446339,-0.4017339618098185],
    translation: [-2.496929859731872,9.260278088696962,-18.57653028213521],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S5P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S5P/r.json"
  },
  {
    quat: [-0.004200322578610437,0.9998822271406113,-0.0012680231661328211,0.014706503861114474],
    translation: [-1.0242479637600197,9.278733639655346,-17.665882867256695],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S6P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S6P/r.json"
  },
  {
    quat: [-0.006566397265807827,0.9897900653247071,0.0001763900299138736,0.1423814520856458],
    translation: [-1.5095034683564488,9.176760177968887,-14.26503691770627],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S7P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S7P/r.json"
  },
  {
    quat: [-0.0044706739574443795,0.9286231493785794,-0.003981905070783612,0.37097601532253033],
    translation: [-1.2119850428627572,9.177014763446667,-12.823923785516183],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S8P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S8P/r.json"
  },
  {
    quat: [0.0011244511915566159,0.910271888941843,-0.001427137647914053,-0.41400698918001466],
    translation: [-0.21704780318624378,9.178336225819628,-12.845029038205391],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S9P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S9P/r.json"
  },
  {
    quat: [0.002316963887638124,0.9668068464198701,0.001887149356823804,-0.2554908844974981],
    translation: [-5.520620757394256,13.300462193637825,-10.428312974584284],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S10P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S10P/r.json"
  },
  {
    quat: [0.001230197015493149,0.9987044860515714,0.004452022693390183,0.050675592248215495],
    translation: [-4.400341706858317,13.271530397699866,-9.042906782249924],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S11P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S11P/r.json"
  },
  {
    quat: [0.0004789501162049648,-0.5555906266351447,-0.00044903505129082264,0.8314557261631346],
    translation: [-3.8984820743186894,13.251551204461048,-7.393450759727651],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S12P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S12P/r.json"
  },
  {
    quat: [-0.00190160156290364,0.9548909112625392,-0.001707165983440246,-0.29694581506395806],
    translation: [-2.520126459949808,13.263191844434258,-10.403014491628173],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S13P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S13P/r.json"
  },
  {
    quat: [0.0033938034367193156,0.9130478415182685,0.0005346359966795125,0.4078380013699249],
    translation: [-2.139738506060125,13.246263643965474,-8.6675242162747],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S14P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S14P/r.json"
  },
  {
    quat: [0.002051750689561735,0.7146116497360914,-0.003661891360574445,0.6995088069003537],
    translation: [-0.1360231408311886,13.238766897601632,-8.189149767966356],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S15P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S15P/r.json"
  },
  {
    quat: [-0.002791365182667452,0.964474699766169,-0.0024981383329326927,-0.2641486723348138],
    translation: [0.8180320515603831,1.582691242117992,0.5296232014494766],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S16P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S16P/r.json"
  },
  {
    quat: [0.0031474756629055467,0.9157711401489301,-0.003734554993324471,0.40167071758628586],
    translation: [1.3872513438465157,1.5989130724971723,1.8239264507856277],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S17P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S17P/r.json"
  },
  {
    quat: [-0.006034426933978264,-0.5081445016546958,-0.003348264224584072,0.8612441815521209],
    translation: [1.1618132137311,0.5555698181846562,5.401745534906377],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S18P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S18P/r.json"
  },
  {
    quat: [0.0011902948542987142,0.9998390621442741,-0.0012223346794597914,-0.017858860729329924],
    translation: [3.808684721904915,19.885067739378194,-18.531888349976867],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S19P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S19P/r.json"
  },
  {
    quat: [0.0023170679624060107,0.9988222830337274,0.0019054988123077463,0.04842568724991311],
    translation: [3.592678326445246,19.881361455239542,-15.81249328317675],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S20P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S20P/r.json"
  },
  {
    quat: [0.0015387628263109267,0.6761933568973704,-0.001192809913943731,0.7367216255149728],
    translation: [3.6490557707640185,19.886366444829154,-13.94613270955072],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S21P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S21P/r.json"
  },
  {
    quat: [0.00410591860945734,0.3452036997023143,0.004189200263099005,0.9385094553309016],
    translation: [3.8782015327662362,19.952867295003273,-11.692154203469517],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S22P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S22P/r.json"
  },
  {
    quat: [-0.004489129482260838,-0.04743237125251883,-0.0015987350167336399,0.9988630846718706],
    translation: [1.0327564435727603,19.895735027659946,-12.08492181654411],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S23P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S23P/r.json"
  },
  {
    quat: [-0.0004743337736971866,0.410304938666562,-0.0007616949274968866,0.9119479437633209],
    translation: [0.5435425864144311,19.896923745504328,-9.625696683796498],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S24P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S24P/r.json"
  },
  {
    quat: [-0.0031974539160153285,0.9774696223315568,-0.007591603781901456,-0.2109153414512028],
    translation: [2.3011534386971193,19.880771970259154,-7.434329361187549],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S25P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S25P/r.json"
  },
  {
    quat: [-0.0009731241792870463,-0.06761123280035175,0.0002555960397109926,0.9977112352275147],
    translation: [0.35447327214812674,19.89436331290036,-6.04139801539308],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S26P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S26P/r.json"
  },
  {
    quat: [0.0014657239089152744,-0.5629909004306546,-0.004598807943302731,0.8264489994249409],
    translation: [-0.11528434361934464,19.913189908050963,-5.234372152933115],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S27P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S27P/r.json"
  },
  {
    quat: [0.0013086074010243709,-0.6256327017052744,0.0017914476031259089,0.7801146074898004],
    translation: [-1.519185616953592,19.920080811650095,-5.3968891009224915],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S28P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S28P/r.json"
  },
  {
    quat: [-0.003596476320070547,0.9977882616088269,-0.00018667139775505412,0.0663748107907184],
    translation: [-2.12047712519031,19.872173197131513,-19.220969366199682],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S29P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S29P/r.json"
  },
  {
    quat: [-0.00037380133264064885,0.9997508952132583,0.008735699430397465,0.02053522213938851],
    translation: [-1.386473178303636,19.888901434189247,-15.23199996522536],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S30P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S30P/r.json"
  },
  {
    quat: [0.0028854573795332123,-0.7609170097048236,0.0030395909112291186,0.648835679785907],
    translation: [-1.2425509583183718,19.89979725824714,-13.56474702956934],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S31P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S31P/r.json"
  },
  {
    quat: [0.0040494408101606535,0.9865631369397857,-0.0012931641867331405,0.1633251560141326],
    translation: [-4.943994811749849,19.994607104408757,-18.05086635769811],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S32P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S32P/r.json"
  },
  {
    quat: [0.002399989696424961,0.9579244700530674,0.010116446546752896,-0.2868320191894095],
    translation: [-4.331334417173362,20.00246492903801,-14.564109126634666],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S33P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S33P/r.json"
  },
  {
    quat: [-0.0006707989858912117,-0.7671850320132342,-0.0032281063140256598,0.6414173805045831],
    translation: [-2.3593753274815836,19.996154694021257,-11.314333817650704],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S34P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S34P/r.json"
  },
  {
    quat: [-0.008941815238359921,-0.7433333388879694,-0.006994903273019794,0.6688248369884863],
    translation: [-2.0071767905299396,20.01035999053422,-7.899094204182167],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S35P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S35P/r.json"
  },
  {
    quat: [0.007829903842347271,0.9386020716603908,0.025381681666576342,-0.3439776357794418],
    translation: [-5.476130586594743,20.01788638593895,-9.131985003923075],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S36P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S36P/r.json"
  },
  {
    quat: [0.0011500381836128861,0.9989701313670356,-0.0019620372548110176,-0.045315609435542734],
    translation: [-5.346236241161385,20.1169712776576,-10.403738979162934],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S37P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S37P/r.json"
  },
  {
    quat: [0.0026752064000002806,-0.5493627785776084,0.0038467722459865016,0.835570812754658],
    translation: [-5.319132217345253,20.10435850530962,-5.702312819110372],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S38P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S38P/r.json"
  },
  {
    quat: [0.005604972970699108,0.9144860418809979,0.0012074903769177736,0.40457682267996176],
    translation: [0.24679294254297512,19.989200883680176,-19.173897259539483],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S39P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S39P/r.json"
  },
  {
    quat: [0.00010444551201564811,0.7977969702903805,0.00012691367137174106,0.602926170587693],
    translation: [0.9349951908963242,20.00295065890689,-16.023788475091504],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S40P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S40P/r.json"
  },
  {
    quat: [-0.0036068616949158964,0.8766853238360659,0.003193968008846699,0.48104015641890496],
    translation: [0.21072840953046812,20.013670963869107,-14.059932411774554],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S41P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S41P/r.json"
  },
  {
    quat: [-0.00048666851686063675,0.10255676454272512,0.0016949855398980087,0.9947255904139098],
    translation: [6.714921830912854,19.888473329979618,-0.4594275606554632],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S42P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S42P/r.json"
  },
  {
    quat: [-0.0025276197527496756,0.9583194393749571,0.00029506554688248787,0.2856875499400988],
    translation: [5.980345938027461,19.893905781280896,-3.939421173952577],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S43P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S43P/r.json"
  },
  {
    quat: [-0.001279984135246458,0.5058835745540672,0.0034722241118038013,0.8625938292711904],
    translation: [3.1252224655521923,19.89356922626327,-3.6230462274494704],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S44P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S44P/r.json"
  },
  {
    quat: [-0.003105821465470204,-0.049515480639929985,0.001135957278691172,0.9987678812672539],
    translation: [4.161613662870979,19.894124373401915,-0.25333551006714394],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S45P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S45P/r.json"
  },
  {
    quat: [-0.0012469766661353952,0.5984378457005404,0.0014835362088987344,0.8011668921035161],
    translation: [6.140218450849664,19.901348466697897,-6.019249803041909],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S46P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S46P/r.json"
  },
  {
    quat: [-0.0007955896090224097,0.6549899562815213,0.0030093667437097278,0.7556311718813803],
    translation: [5.634730674480955,19.910632670775733,-8.286543257590756],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S47P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S47P/r.json"
  },
  {
    quat: [-0.003555569105383738,0.8366498927815754,0.0011672326870280122,0.5477252526637096],
    translation: [6.802533276260408,19.905420015424713,-10.75309676532804],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S48P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S48P/r.json"
  },
  {
    quat: [0.0028699820467018664,-0.8256839535885044,0.0019242179714861727,0.5641223886480242],
    translation: [5.069233265457986,19.145985524323553,-10.831067541653905],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S49P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S49P/r.json"
  },
  {
    quat: [-0.0014330170763644488,0.8883235470084524,-0.0038722520846500197,-0.4591995513457887],
    translation: [5.2735363481472755,19.534294026411672,-10.841640039657257],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S50P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S50P/r.json"
  },
  {
    quat: [-0.0006393870881571922,-0.5542298587390848,0.0034955638013895417,0.8323560751867265],
    translation: [0.8404039165583096,19.900655162963933,-3.384415217990239],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S51P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S51P/r.json"
  },
  {
    quat: [0.0010029690129506903,0.296622729121639,0.0013775530118395032,0.9549932214258465],
    translation: [1.5020882782475073,19.88440795381899,-0.22515992876799018],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S52P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S52P/r.json"
  },
  {
    quat: [-0.0044385088270090765,-0.23851444109991995,-0.000037898064312451735,0.9711288068994687],
    translation: [5.4822855542506,5.923002091633992,-11.081199894114318],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S90P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S90P/r.json"
  },
  {
    quat: [0.0023475312743957916,0.938674990160944,-0.0002480195929072603,0.3447951427000516],
    translation: [6.789521765712464,5.935445984104705,-11.524746240154997],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S91P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S91P/r.json"
  },
  {
    quat: [0.003235514265873648,0.6844236252879468,-0.0010067297682656408,0.7290766894436713],
    translation: [6.476645415301976,5.900947180155158,-7.3129800300218335],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S92P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S92P/r.json"
  },
  {
    quat: [-0.0019398542436003356,0.15799698296627826,-0.002014437000277825,0.9874356345517629],
    translation: [5.104895408705482,5.923865283402453,-0.7748562992566441],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S93P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S93P/r.json"
  },
  {
    quat: [0.0028277672468269605,-0.31751605556135976,-0.0012882934980913603,0.9482478043702305],
    translation: [6.609295181278005,5.910366847312673,-0.8389348876947995],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S94P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S94P/r.json"
  },
  {
    quat: [0.0011291276820211845,0.5771907591902338,-0.0036997027289426684,0.8166001866128664],
    translation: [6.2081751149724544,5.920219237344687,-2.6669770790646057],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S95P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S95P/r.json"
  },
  {
    quat: [0.0024897557016519277,0.9993752519555741,-0.0017731520793586133,-0.03521026593171847],
    translation: [2.886517446448088,5.8686778345411765,-8.860009183243406],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S96P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S96P/r.json"
  },
  {
    quat: [-0.0006107227606810735,-0.28192439992981544,-0.0004063893051409582,0.9594363421247176],
    translation: [2.8158949775533975,5.881191629249138,-5.85267638064259],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S97P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S97P/r.json"
  },
  {
    quat: [0.0041608157760761955,-0.4641735803910554,0.00037887413576703793,0.8857344022522033],
    translation: [2.162762792992471,5.848488132129096,-0.6552747776552934],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S98P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S98P/r.json"
  },
  {
    quat: [0.0010814753999522663,0.46418955556740954,-0.002867542397028663,0.8857305821261613],
    translation: [3.410617200216419,5.902978808209281,-2.8797538550208683],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S99P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S99P/r.json"
  },
  {
    quat: [-0.0012954815474027221,0.47362255597352904,-0.0013840932911744503,0.8807258827162688],
    translation: [3.6694141761660566,5.913380997514821,-4.233595144019609],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S100P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S100P/r.json"
  },
  {
    quat: [0.002356460055367136,-0.1654659936683819,0.003197174245290475,0.9862074985073703],
    translation: [4.534462991964361,5.927021071298387,-4.66005858461563],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S101P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S101P/r.json"
  },
  {
    quat: [0.0029061559929412467,-0.010137286925295459,0.000017701346147943024,0.9999443931328388],
    translation: [7.730670458564743,1.665860486678735,-21.71162474957007],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S53P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S53P/r.json"
  },
  {
    quat: [0.003974051244111818,0.9228864429065644,-0.00329768924820605,0.38503758993324283],
    translation: [4.875227928213176,1.5927298490646766,-22.65266968590536],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S54P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S54P/r.json"
  },
  {
    quat: [0.005548365319950172,0.48435541561353573,0.0005228389788783524,0.8748535726891024],
    translation: [2.7893541551872754,1.599193951114163,-22.073873445649014],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S55P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S55P/r.json"
  },
  {
    quat: [0.0027499685049803303,0.9998700437367742,-0.0034246905069795683,0.015511441131440559],
    translation: [-0.6664394644155621,1.5972523764596964,-20.410649823060403],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S56P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S56P/r.json"
  },
  {
    quat: [0.002264821237692034,0.9997117078860404,-0.0013567715878575943,0.023864845928602493],
    translation: [-0.9741142216643683,1.6098095608158278,-23.395290524770083],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S57P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S57P/r.json"
  },
  {
    quat: [-0.0026221065788323153,0.944105876141812,-0.004153682017397937,-0.3296057737924037],
    translation: [-3.532142330666576,1.6172402679134414,-22.107432182931447],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S58P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S58P/r.json"
  },
  {
    quat: [0.0035080408568633472,0.9928355049631844,-0.0008306521051797024,0.1194347677643548],
    translation: [-6.082165705188834,1.6216288706885216,-22.45501966762258],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S59P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S59P/r.json"
  },
  {
    quat: [0.0020959721600638617,0.9976751066707427,0.0011675911747463337,-0.06810745305086037],
    translation: [-0.6738960359265915,1.5909309516360928,-18.25247178162553],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S60P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S60P/r.json"
  },
  {
    quat: [0.00011089545620419809,0.9517029033831207,-0.004320750073200902,0.3069900690790196],
    translation: [3.036067752134048,1.589138518829781,-18.303857306897278],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S61P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S61P/r.json"
  },
  {
    quat: [0.0024420109279310563,0.9253727039841189,-0.004479287044054107,0.3790241829901163],
    translation: [4.370430863962386,1.6092640879881905,-15.518752231840633],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S62P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S62P/r.json"
  },
  {
    quat: [-0.001678481351393116,0.9045625955716556,-0.001542349244670904,-0.4263347447157336],
    translation: [-3.2868431667031297,1.6427872447766525,-17.53399167646915],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S63P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S63P/r.json"
  },
  {
    quat: [0.004473385301399841,0.5223913137121113,-0.0006631947547728125,0.8526938866639522],
    translation: [1.078355724250621,1.6361396251419897,-12.695328741323898],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S64P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S64P/r.json"
  },
  {
    quat: [0.0025646383610420246,0.9900791407040824,-0.0054360016572937925,0.14038221988102584],
    translation: [5.623339348956814,1.6201563869401099,-11.790932665485345],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S65P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S65P/r.json"
  },
  {
    quat: [0.000990691806006673,-0.00602806951745013,0.002252853659215349,0.9999788025543483],
    translation: [5.869167360754439,13.530646956198037,-0.41389124698598323],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S66P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S66P/r.json"
  },
  {
    quat: [0.0043182909190017495,-0.09180095924127486,0.0016267594422325017,0.9957666844696345],
    translation: [-7.608945322562691,1.4077049472153096,-1.7242174049102728],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S67P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S67P/r.json"
  },
  {
    quat: [-0.0026375865107754804,0.25559979295519863,-0.0004954221588958621,0.9667789527785076],
    translation: [-7.248333980353905,1.5889712922863612,-5.991246658780462],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S68P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S68P/r.json"
  },
  {
    quat: [0.0017547193250687034,0.9993617085696439,-0.0007988028909780903,-0.03567153373200717],
    translation: [-7.095329454162995,1.6267727379506525,-9.559915379551773],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S69P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S69P/r.json"
  },
  {
    quat: [0.0012947494345652228,0.6665450941100981,-0.002086116510722613,0.7454606691568901],
    translation: [-6.2686678866705545,1.6570517260807733,-12.260742735741985],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S70P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S70P/r.json"
  },
  {
    quat: [0.0020255909322243184,-0.3300922160156012,-0.0008994322111912286,0.9439460879356041],
    translation: [-7.926330148874698,1.655968985743005,-12.997295346742527],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S71P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S71P/r.json"
  },
  {
    quat: [0.0028746245099108077,-0.8315384313458611,0.00014709368126500822,0.5554597664043534],
    translation: [-6.670774097318263,1.6708210212677947,-16.04705823850354],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S72P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S72P/r.json"
  },
  {
    quat: [0.00008844401243930288,-0.6325029706700301,0.001017905984060443,0.7745572594318629],
    translation: [-7.090515375152021,1.6609728844795946,-18.11911212239695],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S73P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S73P/r.json"
  },
  {
    quat: [-0.0006954558268393148,0.9982918756906902,0.0034881151271516702,0.058315352386967154],
    translation: [-7.83386200027277,1.6629633346926624,-20.528963873201736],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S74P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S74P/r.json"
  },
  {
    quat: [-0.0033754631822163635,-0.7483927012722431,0.0004914203361198291,0.6632471103870056],
    translation: [-4.812746876824519,1.650202249634658,-12.078491232479724],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S75P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S75P/r.json"
  },
  {
    quat: [0.0023922178730819395,0.8469229886182079,0.0028930119817568204,0.5317023219126313],
    translation: [-2.0606290843706065,1.6472048753866844,-12.52530009195847],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S76P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S76P/r.json"
  },
  {
    quat: [0.004737487102255199,0.999957808306092,-0.007401073879511863,0.0026761780701263253],
    translation: [1.0319938231108683,1.5114501084819487,-4.526522639785266],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S77P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S77P/r.json"
  },
  {
    quat: [0.004144563783360163,0.996950681247711,-0.0027425594061377,-0.0778757993132294],
    translation: [1.0453857376462854,1.7640058473050928,-6.211461627936753],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S78P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S78P/r.json"
  },
  {
    quat: [-0.0022094849884260223,0.3270237681682704,-0.0005476424028404069,0.9450133720307081],
    translation: [3.6713088719589577,1.7714277650841002,-5.466893042857671],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S79P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S79P/r.json"
  },
  {
    quat: [0.0037764394709800353,-0.03790636738577275,0.0026384911071977405,0.9992706761339563],
    translation: [3.6130359248857897,1.4903871005393015,-2.662333572973875],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S80P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S80P/r.json"
  },
  {
    quat: [-0.0011171542518028548,0.6386092300779764,-0.0005492627977682189,0.769530182342418],
    translation: [6.357532386867035,1.5126517946204867,-6.259812409271818],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S81P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S81P/r.json"
  },
  {
    quat: [0.004099351269639474,-0.22136272079019081,0.0001657889608254165,0.9751829129335077],
    translation: [5.934903440790106,1.5559284825080564,-2.6765196994446567],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S82P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S82P/r.json"
  },
  {
    quat: [0.0032401666404205903,-0.3185811291085193,0.004656651427448897,0.9478786214981757],
    translation: [5.552599351206589,1.5533197793230276,-0.33516669078961314],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S83P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S83P/r.json"
  },
  {
    quat: [0.003327556600419905,-0.26345678788972254,0.003932422425581287,0.9646574440368129],
    translation: [3.0772055967091507,0.43992504552281986,-0.23286923460396736],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S84P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S84P/r.json"
  },
  {
    quat: [0.0032233321016917325,0.9298399071230556,-0.00009454836318876262,0.3679501981412112],
    translation: [3.3647296763588255,1.72500952205508,-8.236117181313253],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S85P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S85P/r.json"
  },
  {
    quat: [-0.005273683908239357,-0.20081788233174944,0.003387532184730809,0.9796085396828166],
    translation: [-3.1880996524624723,1.7522915081346344,-10.17145718437401],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S86P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S86P/r.json"
  },
  {
    quat: [-0.002128598748944618,-0.06656109551056665,-0.0015408251223711237,0.997778891082459],
    translation: [-3.403671813662108,1.7297092009963304,-6.911457589412821],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S87P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S87P/r.json"
  },
  {
    quat: [0.002722798259014319,0.798337642481249,0.0022461868797585788,0.6021997588923332],
    translation: [4.831696529656492,1.7327192031753036,-9.377221069391101],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S88P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S88P/r.json"
  },
  {
    quat: [0.0035240476690402444,0.7862316390106859,0.004761612982566109,0.6179034859473944],
    translation: [6.294148196442666,1.544889463893874,-9.175326799494842],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S89P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S89P/r.json"
  },
  {
    quat: [-0.0025897888150948605,-0.722669243317843,0.0012911923458821797,0.6911879560432161],
    translation: [-0.0970097850563364,5.886548077118935,-12.71274452473209],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S102P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S102P/r.json"
  },
  {
    quat: [0.005941236269752689,-0.47700598244268644,0.0023683585750488524,0.8788767748109159],
    translation: [-4.4804784267262265,5.922705860554454,-11.84131313619038],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S103P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S103P/r.json"
  },
  {
    quat: [0.0064314338337913045,0.15998040130026545,-0.0034667800623900675,0.9870931512753206],
    translation: [-3.979705416842243,5.92321677057312,-12.530049165066494],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S104P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S104P/r.json"
  },
  {
    quat: [-0.006331201209547871,-0.6236415514466586,-0.0021999052660651823,0.7816817073579355],
    translation: [-1.7544153900956616,5.909183521598318,-12.641568708497088],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S105P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S105P/r.json"
  },
  {
    quat: [0.006627461886644386,0.9237738895202187,0.006716738072240054,-0.38282210388024485],
    translation: [-5.11819538417614,6.032970105147999,-14.864838256939002],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S106P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S106P/r.json"
  },
  {
    quat: [0.008036216902130766,0.9996626601513896,0.0005151563117834756,0.024692503536980444],
    translation: [-3.0680661857690383,5.981226045918856,-14.997329340278476],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S107P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S107P/r.json"
  },
  {
    quat: [-0.003405660409731003,0.9929631400767216,0.001544545874001087,-0.11836476800211168],
    translation: [-1.5916089488720504,5.974763497730771,-14.857333490415147],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S108P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S108P/r.json"
  },
  {
    quat: [-0.0017344118508936387,0.4208157417664066,-0.001405891403827884,0.9071433882063912],
    translation: [1.1272055947092419,1.6194743088995551,-2.383303110381293],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S109P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S109P/r.json"
  },
  {
    quat: [-0.0007561791864033831,0.9750454885483358,-0.0025682604989657365,0.22198902561294492],
    translation: [-2.617687583198459,23.568882179211165,-17.978209109234015],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S222P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S222P/r.json"
  },
  {
    quat: [-0.0010576132689431887,-0.25226199131496047,-0.0012930064396089722,0.967657531013072],
    translation: [-1.9510831821178805,23.544300129256555,-14.03925368692625],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S223P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S223P/r.json"
  },
  {
    quat: [-0.0031871695891612464,-0.22544335057654566,-0.00209411399095448,0.974248814378267],
    translation: [-2.1701536092652534,23.553798876010646,-10.03200256441082],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S224P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S224P/r.json"
  },
  {
    quat: [0.0008954824745307953,0.03998465776175109,-0.003240748259915676,0.9991946370980621],
    translation: [-0.9281519463127008,23.554088689949996,-6.11954018861935],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S225P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S225P/r.json"
  },
  {
    quat: [0.0040488796332054135,-0.08230699416822745,-0.002007705114590471,0.9965967762364415],
    translation: [-1.1292049306871172,23.55555357370473,-3.1578847113270703],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S226P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S226P/r.json"
  },
  {
    quat: [0.0009411510757667998,-0.22378622441173363,-0.0007052027655261358,0.9746375442631273],
    translation: [-2.583445121180828,23.553679047591636,-3.5239660548234646],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S227P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S227P/r.json"
  },
  {
    quat: [-0.0020974133830081666,0.9963182100005377,-0.001448789948381863,0.08569437721409068],
    translation: [-4.5431734725354485,23.473055778042493,-6.307742494649183],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S228P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S228P/r.json"
  },
  {
    quat: [-0.002221418262218706,0.9912884660005646,-0.002096787300726529,0.1316732545286525],
    translation: [2.4120823694797715,23.68043327620358,-17.910955804621],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S110P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S110P/r.json"
  },
  {
    quat: [0.006504035739980107,0.12442226306782521,-0.003135546200723118,0.992203087236827],
    translation: [2.4505872461479163,23.669135375415358,-13.673076146069029],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S111P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S111P/r.json"
  },
  {
    quat: [0.002722183906836353,0.11347000161666239,-0.005014102842746308,0.9949150410636628],
    translation: [2.187289819083381,23.668270042914017,-9.525024825013176],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S112P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S112P/r.json"
  },
  {
    quat: [-0.002860228932321364,0.10732946309580085,-0.003912526095192789,0.9942116965624332],
    translation: [6.94862600377385,23.673523746275734,-8.095640705287833],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S113P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S113P/r.json"
  },
  {
    quat: [0.00315885788263075,-0.4270910680023871,-0.00011602206150283163,0.904203089902116],
    translation: [6.907975186293272,23.68958115482674,-2.716365903791406],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S114P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S114P/r.json"
  },
  {
    quat: [-0.0005313091544536172,0.23341290107704693,0.0007630295382233819,0.9723772689174186],
    translation: [1.9448927764664936,23.69169638270901,-1.5561223519845386],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S115P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S115P/r.json"
  },
  {
    quat: [-0.001191179966619039,-0.12795972824763413,0.003632775042401466,0.9917719959660941],
    translation: [-1.9039121425373406,16.53217920947278,-4.9658796310600195],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S132P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S132P/r.json"
  },
  {
    quat: [-0.0018679691225566687,0.9996827597850232,0.002576954369532872,-0.024984991217410775],
    translation: [-1.3800572624994505,16.52479228228693,-5.926230535429193],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S133P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S133P/r.json"
  },
  {
    quat: [0.00029449904093630435,0.19914254538691176,-0.001432481221268793,0.9799694423218958],
    translation: [-1.1681548648594946,16.489079412437825,-14.000308581934338],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S134P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S134P/r.json"
  },
  {
    quat: [0.004955450547037553,-0.2861174349066105,-0.0012708400626381174,0.9581809025011345],
    translation: [-2.578301625385093,16.47595182734978,-12.591539742107852],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S135P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S135P/r.json"
  },
  {
    quat: [0.0005800823081386444,-0.8095894451184292,-0.0025900509237382573,0.5869905327121238],
    translation: [-4.463741641299462,16.439016308141085,-6.98347919574625],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S136P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S136P/r.json"
  },
  {
    quat: [0.003334037976724874,0.9699614073528281,0.005112865018979243,0.24318225890921533],
    translation: [-5.599047058363605,16.45699768940444,-10.000845947874927],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S137P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S137P/r.json"
  },
  {
    quat: [0.00027933183822697195,0.9946567759069714,-0.0007026259938974891,0.10323432778289164],
    translation: [-5.482158126581673,16.51904122383991,-10.603822770623196],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S138P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S138P/r.json"
  },
  {
    quat: [-0.001194400451372656,0.9832647954885755,-0.005408954761060101,0.18209793675043215],
    translation: [-2.9240442216778315,16.43726386565362,-8.209027156641719],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S139P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S139P/r.json"
  },
  {
    quat: [-0.00595442857177676,-0.6552289127696711,0.0005257962646415911,0.7554067382472015],
    translation: [-4.583952050957644,16.539107712736197,-14.149704925839522],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S140P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S140P/r.json"
  },
  {
    quat: [0.0021272836376267576,0.8988122205312461,-0.0013923025761163226,-0.4383265088738671],
    translation: [-2.643108652820387,16.548388095298627,-14.686096908447666],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S141P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S141P/r.json"
  },
  {
    quat: [0.003772466712836494,0.9291873019972758,0.003107704225398335,0.3695768776267954],
    translation: [-1.1454766705007364,16.59675461925265,-16.196594387445383],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S142P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S142P/r.json"
  },
  {
    quat: [0.0038633376324745017,0.9482222659584154,0.0017827428372359502,-0.3175790150356316],
    translation: [-1.3512387499605285,16.564375238224212,-19.13242575952333],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S143P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S143P/r.json"
  },
  {
    quat: [-0.0009278615854429426,-0.07880251687097904,-0.005476547287197205,0.9968747713918094],
    translation: [-2.0069186769221203,20.013932909062497,-2.2716868588436725],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S144P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S144P/r.json"
  },
  {
    quat: [-0.002464030188231474,-0.000029565532013111898,-0.0011016228314132692,0.9999963570474886],
    translation: [-1.836647393809367,19.99708144567233,-4.753349702679732],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S145P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S145P/r.json"
  },
  {
    quat: [0.000026736330432375116,-0.7252581718632249,0.0006530302288707141,0.6884766931293218],
    translation: [-3.8436209713227516,19.978355382358338,-4.0234530939377295],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S146P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S146P/r.json"
  },
  {
    quat: [0.0009042476078514886,-0.01658639456738999,0.0032895250823070936,0.9998566161586626],
    translation: [-3.914691664252032,21.702945224550227,-0.34046805371770716],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S147P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S147P/r.json"
  },
  {
    quat: [-0.002265260355165432,-0.7376253002385431,0.0009027555756422009,0.6752058723649957],
    translation: [-5.542815881438238,21.72075969865051,-0.3259154175309362],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S148P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S148P/r.json"
  },
  {
    quat: [0.0024393768616023906,0.9999450297403292,0.0015126112632210332,0.010084589496141376],
    translation: [-5.691966354838309,23.44730562599837,-4.009531334031913],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S149P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S149P/r.json"
  },
  {
    quat: [0.00010812642588440627,-0.03721538140039915,0.0031553078051439966,0.9993022804579967],
    translation: [-4.717895545745848,23.453887952653666,-4.762619266232265],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S150P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S150P/r.json"
  },
  {
    quat: [-0.0025080048964011034,-0.7230966686631879,-0.0012742630275425324,0.6907411193301265],
    translation: [-5.570114845590927,19.963866133184275,-3.9249088800118557],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S151P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S151P/r.json"
  },
  {
    quat: [-0.0025388465791975168,-0.7003164296768097,-0.0024744597842958752,0.7138237384911585],
    translation: [-5.349053286783012,18.23910683151199,-0.25438064349466316],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S152P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S152P/r.json"
  },
  {
    quat: [0.0035584478436194236,-0.06165052995566192,0.000057923338757850785,0.998091451846983],
    translation: [-3.913784636608959,18.214677572341913,-0.40762776575972737],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S153P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S153P/r.json"
  },
  {
    quat: [-0.0027187635182754355,-0.7146874067182977,0.001956214878373401,0.6994359815075749],
    translation: [-5.405362941816713,16.477429200084835,-4.348179538116312],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S154P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S154P/r.json"
  },
  {
    quat: [-0.0003478573210935416,-0.7222878343222138,0.0002876754461108342,0.6915924237787963],
    translation: [-3.701607372600497,16.500202191254267,-4.428729283215971],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S155P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S155P/r.json"
  },
  {
    quat: [0.006655258275866431,0.35676745192851567,-0.0017745262569609436,0.9341678349413004],
    translation: [-1.824282254145913,16.51868800787097,-2.227115223196721],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S156P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S156P/r.json"
  },
  {
    quat: [-0.00034080579878622544,-0.7374980448199051,0.0005785201796567689,0.6753489342944368],
    translation: [-5.211494282866571,14.843023797064436,-0.07672614772039132],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S157P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S157P/r.json"
  },
  {
    quat: [-0.001253207116001443,0.004884757172629047,0.0030081419246370676,0.9999827597021113],
    translation: [-3.9147063541055624,14.840745378021145,-0.30674798996794017],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S158P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S158P/r.json"
  },
  {
    quat: [-0.007594247313481564,0.9931531505351903,-0.0011698446495657508,0.11656662667017169],
    translation: [-3.931373996560497,13.240166712192135,-5.332968888202512],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S159P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S159P/r.json"
  },
  {
    quat: [0.0024328697631136346,0.5197413580192858,-0.000411031252198898,0.8543200998234538],
    translation: [-2.2125763750856224,13.201281282183864,-3.2069692188559165],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S160P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S160P/r.json"
  },
  {
    quat: [0.0015199740607282804,-0.40033908985232175,0.003129568797106591,0.9163604687097638],
    translation: [-1.5145737229357048,13.185295693407582,-5.80475618346721],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S161P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S161P/r.json"
  },
  {
    quat: [0.0008359074632929819,0.6038498870140389,0.0011866663079989513,0.7970967363092726],
    translation: [0.7639056886486992,13.19743066066678,-5.619167953880892],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S162P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S162P/r.json"
  },
  {
    quat: [0.0014018239869943185,0.9905785594152189,-0.00021504261059518035,-0.13693833018207394],
    translation: [0.9846404626103795,13.202112798878437,-9.253954889418669],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S163P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S163P/r.json"
  },
  {
    quat: [0.0001602023399374153,0.9946762708909763,-0.0025927991984069617,-0.10301634750828693],
    translation: [0.9577422945920482,13.263454734288805,-11.865923860147694],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S164P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S164P/r.json"
  },
  {
    quat: [-0.0005323026021391412,-0.1939022703338757,0.001757807693365764,0.9810191314777839],
    translation: [-2.4320345742835396,9.064258878834881,-2.5536266522361784],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S165P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S165P/r.json"
  },
  {
    quat: [0.000549050572991285,0.9777162114004262,-0.0007083546411073669,0.2099290516864397],
    translation: [-1.3556374346639366,9.063538536022335,-5.725201039410092],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S166P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S166P/r.json"
  },
  {
    quat: [0.00023806907516047288,0.6759004001790662,-0.0017767296107224365,0.7369907974953795],
    translation: [0.5400273918462405,9.105633773110306,-5.158971730098477],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S167P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S167P/r.json"
  },
  {
    quat: [0.0016109455991053497,0.9985524059713154,-0.00029839235914356897,0.053762518032305556],
    translation: [0.6503357519266676,9.116931526163217,-9.319868904605874],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S168P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S168P/r.json"
  },
  {
    quat: [0.0006577684704713838,0.9943657728581122,0.0003887648690338449,0.10600059420024477],
    translation: [0.6269163727703683,9.122073170771207,-13.156903845941201],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S169P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S169P/r.json"
  },
  {
    quat: [0.00008686835881407116,0.9992761971833963,0.0015834599825287152,0.038007457834772405],
    translation: [0.648749610137153,5.948130793719401,-13.058985295320205],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S170P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S170P/r.json"
  },
  {
    quat: [0.0021370106249306285,0.9985074133548418,0.0005942133623637828,0.054571288893446236],
    translation: [0.6167387897197629,5.933451480068775,-9.390128766883114],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S171P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S171P/r.json"
  },
  {
    quat: [0.0016743006058002221,0.999660471016381,0.0007850504916050542,0.0259908272379759],
    translation: [0.6789474710776053,5.941579241767721,-5.251276556815844],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S172P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S172P/r.json"
  },
  {
    quat: [-0.0019755761527262827,0.7103539109046232,0.004631240405295915,0.7038266618805883],
    translation: [0.04834584461122382,5.9381821099124075,-2.611682397037356],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S173P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S173P/r.json"
  },
  {
    quat: [0.0001870010325698798,0.13599345198422888,-0.0003577203636495535,0.9907096537755997],
    translation: [-1.8603680486439969,5.919834288709346,-4.60043867055411],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S174P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S174P/r.json"
  },
  {
    quat: [0.0019229110451678634,0.9999432031946106,-0.0016317872903572953,0.010355195230083698],
    translation: [-2.7473454098936374,1.5942306637040318,-1.2786330109815474],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S175P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S175P/r.json"
  },
  {
    quat: [-0.001828995482536776,-0.8556704665288981,-0.0028286080037598985,0.5175101027593593],
    translation: [-1.9424016258138872,1.592992227683192,-3.3069208918907904],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S176P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S176P/r.json"
  },
  {
    quat: [0.0005558988688026693,-0.849551145165673,-0.00013408047124802003,0.5275059475935164],
    translation: [-5.499063852681755,13.220430139097763,-5.269094567716911],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S177P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S177P/r.json"
  },
  {
    quat: [0.001128399405439058,-0.4113324314251885,0.0013554634227433394,0.911483691730994],
    translation: [-5.384624360344517,11.014352067752899,-0.11310853143629096],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S178P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S178P/r.json"
  },
  {
    quat: [0.000929697713712048,0.37514412545320247,0.0017405387566052988,0.9269643959316686],
    translation: [-3.902636929160691,11.011872981776037,-0.2700906300500101],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S179P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S179P/r.json"
  },
  {
    quat: [-0.0007725715589013375,-0.7946507907738359,0.0005465185305635847,0.607066079741956],
    translation: [-3.973143608400519,9.101516122216434,-5.38728393693901],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S180P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S180P/r.json"
  },
  {
    quat: [-0.0001808674314201927,0.9225987613777985,-0.003410083377258651,-0.3857458543166528],
    translation: [-5.514686030610778,9.096873091399459,-5.235060555083926],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S181P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S181P/r.json"
  },
  {
    quat: [-0.00021532964597145506,0.047447277808589865,0.00029004242179220914,0.9988736783683368],
    translation: [-5.192892080974558,7.494030196278443,-0.08453265185127279],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S182P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S182P/r.json"
  },
  {
    quat: [-0.0012460974924317612,0.03482294813172954,0.0015615732343755113,0.9993915003708446],
    translation: [-3.8716336282386825,7.4908488581344965,-0.40369770068577004],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S183P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S183P/r.json"
  },
  {
    quat: [0.002347240194710891,0.9965121013716397,0.0012092864850330586,-0.0834065939212505],
    translation: [-4.173641320836495,5.914934862996853,-5.297949084200397],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S184P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S184P/r.json"
  },
  {
    quat: [-0.00210170166343961,-0.5001493070583547,-0.0002726905713863365,0.8659365907149066],
    translation: [-5.583648844312049,5.905587259864327,-3.882354407977818],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S185P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S185P/r.json"
  },
  {
    quat: [-0.0024382409367379666,-0.02302316221954632,0.0001310815579405281,0.9997319499746781],
    translation: [-5.3622874447610975,4.470283254639226,-0.03563584053849844],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S186P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S186P/r.json"
  },
  {
    quat: [-0.000473865634894462,-0.11609615546131394,0.0033086666841827548,0.993232354921669],
    translation: [-3.990372950913888,4.469432371565398,-0.27636251773664355],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S187P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S187P/r.json"
  },
  {
    quat: [0.002670079754066342,0.9992782059969078,-0.0019230854547022116,-0.03784493937163124],
    translation: [-3.934887873769684,3.030369002692993,-4.017057504899435],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S188P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S188P/r.json"
  },
  {
    quat: [0.001047303810459436,0.9957376849320924,0.0052062040864891065,0.09207747498609854],
    translation: [-5.437485635135255,3.029040908497322,-3.9816079009546392],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S189P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S189P/r.json"
  },
  {
    quat: [-0.0038663913113006587,0.11098528061915298,0.00017658203698416334,0.9938145135400823],
    translation: [-5.694946818439287,1.609791116260153,-0.08605747720992696],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S190P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S190P/r.json"
  },
  {
    quat: [-0.00019425742289380608,-0.25381782035537803,0.0027082265999756453,0.9672482317599373],
    translation: [1.6864937235087938,13.260228170083593,-4.585950477103727],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S119P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S119P/r.json"
  },
  {
    quat: [0.0036967968777133218,0.17436282020010133,0.003593832884170753,0.9846679770307594],
    translation: [5.778633346405027,13.262261283682697,-4.415840702203605],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S120P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S120P/r.json"
  },
  {
    quat: [0.0015329102715458441,-0.04500002403086621,0.003304052857095395,0.9989803457816567],
    translation: [0.7040148086774669,13.24954177968086,-0.29121139480522196],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S121P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S121P/r.json"
  },
  {
    quat: [0.0055288355395538445,-0.18451103442973557,0.00026240639029854264,0.9828148560609472],
    translation: [0.2119301997623807,13.242712864236594,-1.8067708471666046],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S122P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S122P/r.json"
  },
  {
    quat: [-0.0010846690565716945,-0.7071138620377692,-0.002338876169855031,0.7070950001695061],
    translation: [0.740604392313813,13.235124708889387,-3.9039682531218522],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S123P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S123P/r.json"
  },
  {
    quat: [0.0008135962401135225,0.7141346335285382,-0.002447742040379594,0.7000036227157305],
    translation: [4.63503812174506,13.22542589981488,-3.6396582548169576],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S124P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S124P/r.json"
  },
  {
    quat: [0.003111253646053039,-0.02812275405173062,0.002380762654196438,0.9995968001021606],
    translation: [2.863147581541856,13.587777975745048,-0.5353759896056864],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S125P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S125P/r.json"
  },
  {
    quat: [0.0009313012451245927,-0.1484201659976671,0.0024592801241821883,0.9889208962017485],
    translation: [3.1460460470250324,13.2487527141333,-4.46809759391352],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S126P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S126P/r.json"
  },
  {
    quat: [0.005333504026901676,0.6411976783141705,0.0000721447903372875,0.7673572087706427],
    translation: [5.1904508153020075,13.252951260352459,-5.500699312318942],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S127P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S127P/r.json"
  },
  {
    quat: [0.003976091844482754,-0.07860885759880705,0.00535066718946433,0.9968832472066681],
    translation: [5.5536952192006925,13.277507865805536,-10.081176741139272],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S128P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S128P/r.json"
  },
  {
    quat: [0.001149830859515681,-0.7178266056393006,0.0037203936904102366,0.6962110317955321],
    translation: [6.106711122353321,13.278081132357293,-10.899958824321697],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S129P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S129P/r.json"
  },
  {
    quat: [0.0011584273195737853,0.43187051823406464,0.0024542871240884074,0.901931532878772],
    translation: [6.693791650107101,13.19782198851597,-8.704741593141788],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S130P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S130P/r.json"
  },
  {
    quat: [0.000262754362507313,0.012925205968076793,0.00016692516789195376,0.9999164175803976],
    translation: [7.27999980702309,13.18729366130488,-6.386615760427409],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S131P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S131P/r.json"
  },
  {
    quat: [-0.00031417093669344737,0.0803704424637049,0.001254184659113343,0.9967642250279914],
    translation: [7.178265870284754,13.237523368367881,-3.3047912905745784],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S116P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S116P/r.json"
  },
  {
    quat: [0.003936107842595651,0.650662186324208,0.00028929451173735664,0.7593570587363455],
    translation: [1.3071047036764645,13.210153463127384,-8.230160868686053],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S117P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S117P/r.json"
  },
  {
    quat: [0.004694379279978832,0.7135293486576715,0.0007812859570082225,0.700609178499348],
    translation: [3.2293989582056204,13.212883614563633,-8.154900752367055],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S118P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S118P/r.json"
  },
  {
    quat: [0.0019226657516643933,0.9999154837418519,0.003968062357503199,-0.012230421531268123],
    translation: [-1.8663307974072922,5.9128625078072705,-10.055238183645574],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S191P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S191P/r.json"
  },
  {
    quat: [-0.003603823473217073,-0.5595202439440043,-0.0011342245769446905,0.828808073445079],
    translation: [-2.8919698360976125,5.838830647643732,-7.650464028574596],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S192P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S192P/r.json"
  },
  {
    quat: [-0.003256343506659138,-0.4669414729298898,-0.001966650334609103,0.8842800401294337],
    translation: [-1.13859491443142,5.919459887893939,-6.645572755432321],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S193P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S193P/r.json"
  },
  {
    quat: [0.00242422032194166,-0.7020213007896575,0.0033210888487888676,0.7121440772500089],
    translation: [-0.16824570781974552,5.855809337869693,-8.143762732099493],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S194P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S194P/r.json"
  },
  {
    quat: [0.0033625925386447614,0.7200050358971121,-0.0029327637684072936,0.6939544942928808],
    translation: [1.3374794543444797,5.872307163946827,-8.155750127659614],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S195P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S195P/r.json"
  },
  {
    quat: [-0.004854599645649557,0.9343270791177802,0.0059057418762267335,-0.3563347643753121],
    translation: [-5.490710292960854,6.066560198696735,-10.366690604074044],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S196P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S196P/r.json"
  },
  {
    quat: [-0.0051853569389048206,0.9983791893392842,0.006299750985699507,-0.05632423550451476],
    translation: [-4.732473559189714,6.039787652216314,-9.715666373789587],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S197P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S197P/r.json"
  },
  {
    quat: [-0.002548514429406891,0.8538431514201189,-0.0033415653665184136,0.5205134117278829],
    translation: [-5.23849513763567,6.0037047424065255,-8.328264388148222],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S198P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S198P/r.json"
  },
  {
    quat: [-0.006749951189930458,0.2577782242648443,0.0037218860273172134,0.966173365818974],
    translation: [-5.358395138721468,6.005020337681818,-6.7262585569235425],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S199P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S199P/r.json"
  },
  {
    quat: [0.0032450635886725884,-0.6565805082767129,0.005035312889340846,0.7542321601059795],
    translation: [-2.8231699657519713,13.225067150310547,-14.462883774454678],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S200P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S200P/r.json"
  },
  {
    quat: [-0.00600929459680299,0.15158358083788245,0.00631362426791196,0.9884060119947431],
    translation: [-3.558827456541103,13.28634625391112,-11.569833316732556],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S201P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S201P/r.json"
  },
  {
    quat: [0.001782941486390862,0.24817655642880268,0.0030568486079576374,0.9687083532391649],
    translation: [-4.27571476012111,13.263446104390635,-12.261873852386087],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S202P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S202P/r.json"
  },
  {
    quat: [-0.0031853213222061394,-0.5047236064543896,-0.0017859758583929416,0.8632732737122306],
    translation: [-6.228541454260851,13.208611165851702,-13.05732545296926],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S203P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S203P/r.json"
  },
  {
    quat: [-0.0019227325734286534,-0.049262203405692956,0.0035265334975010582,0.9987778041068787],
    translation: [-4.892009895837412,13.461212557861856,-16.140348853256498],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S204P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S204P/r.json"
  },
  {
    quat: [0.0037835401069326677,0.9992744935663268,-0.0026814709448838995,-0.037801865636392894],
    translation: [4.070870598478757,13.289133134059677,-14.10315977090179],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S205P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S205P/r.json"
  },
  {
    quat: [0.002016511005445925,-0.015810515403897173,0.0005442879515525755,0.9998728244315143],
    translation: [0.6766083567842573,13.241432149947165,-12.442846540085094],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S206P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S206P/r.json"
  },
  {
    quat: [0.0008240779130359887,0.909649365365524,-0.0006578671741985558,-0.41537563746141143],
    translation: [0.8079075816322154,13.234774942368574,-13.743557442363599],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S207P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S207P/r.json"
  },
  {
    quat: [-0.003973401997344707,0.9266212472465792,-0.0017101925507437329,0.37597121095796776],
    translation: [2.7482562198079847,13.23711536955128,-13.350023221538418],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S208P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S208P/r.json"
  },
  {
    quat: [0.004755679414432,0.920511583008324,-0.0020870071014807323,0.3906807564523428],
    translation: [3.893658397084989,13.258591643657812,-11.474185874255356],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S209P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S209P/r.json"
  },
  {
    quat: [0.004984941713542004,0.930635730894396,-0.002902013536090804,0.3659014417246843],
    translation: [3.333564338422984,13.255372777873484,-11.534833925866561],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S210P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S210P/r.json"
  },
  {
    quat: [0.0036778052484664225,0.8680961764753315,0.0042747957723977825,0.49636400781943163],
    translation: [4.444132631553703,13.179641360410027,-19.49861453901419],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S211P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S211P/r.json"
  },
  {
    quat: [-0.0004268936173094581,0.9814184903723806,-0.004363572690449458,-0.19182941315244734],
    translation: [-1.302422833013762,13.497676280935812,-19.083768636797988],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S212P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S212P/r.json"
  },
  {
    quat: [0.006587817276258664,0.979205421236082,-0.0009779741189277255,0.20276189792962726],
    translation: [-1.1658521178135124,13.455132227365432,-15.672549527130904],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S213P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S213P/r.json"
  },
  {
    quat: [0.007814359009039517,0.14086219822685905,0.0008909830454491315,0.9899979712369337],
    translation: [-1.636973194606636,13.229662149427526,-12.586762708315623],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S214P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S214P/r.json"
  },
  {
    quat: [-0.00344868350416961,0.887571977202556,-0.00273591964025275,-0.4606480289880286],
    translation: [-2.096756807255026,13.202290406481687,-15.281879694198448],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S215P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S215P/r.json"
  },
  {
    quat: [-0.0007499060990327486,0.8778601380888426,-0.0015429364461331065,0.47891401623110197],
    translation: [-5.283223593107562,13.219910172744514,-14.42253167856107],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S216P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S216P/r.json"
  },
  {
    quat: [0.003972893700482881,0.9927360700900497,0.0002905539973471105,0.12024652525617202],
    translation: [-0.05924144512240831,13.203685604161793,-15.773335544349182],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S217P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S217P/r.json"
  },
  {
    quat: [0.004413637485376514,0.9629446449573481,0.004839147497273501,0.2696195712547852],
    translation: [4.0586872664466025,13.186890433933673,-16.38622962366098],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S218P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S218P/r.json"
  },
  {
    quat: [0.0018527916106635609,0.9573978336222914,0.004996312391474156,0.28872303718456144],
    translation: [0.19802788570175156,13.215220797526772,-20.317123755766573],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S219P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S219P/r.json"
  },
  {
    quat: [0.0017147944274657318,0.9944644542190115,-0.0025615862020495436,0.10502831547294526],
    translation: [-3.312675383161133,13.421249824573978,-19.16915632922136],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S220P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S220P/r.json"
  },
  {
    quat: [0.0036013830076247885,0.7779831941353553,0.0011166155148235922,0.6282737722125937],
    translation: [0.45998011219035606,13.214957365957375,-13.730163024117344],
    loc: "gs://resonai-irocket-public/9491/potree_ybf/S221P/loc.json",
    json: "gs://resonai-irocket-public/9491/potree_structure_files/S221P/r.json"
  }
]

const loadResonaiPotree = async () => {
  // const onLoad = (node: PointCloudOctreeGeometryNode) => {
  //   // console.log('Loaded node!', node);
  // }
  const onLoad = () => {};
  while (sps.length) {
    await Promise.all(sps.splice(0, 1).map(task => {
      // console.log('__________________');
      return fetch(gsToPath(task.loc)).then(res => {
        res.text().then(text => {
          return viewer.loadResonaiPotree(gsToPath(task.json), JSON5.parse(text), [onLoad])
            .then(pco => {
              // pco.visible = index % 2 === 0
              onPCOLoad(pco, task.quat, task.translation)
            })
            .catch(err => console.error(err));
        })
      })
    }))
  }
}

switch (parameters.demoPotree) {
  case DemoPotree.RESONAI_POTREE:
    const camera = viewer.camera;
    camera.far = 1000;
    camera.updateProjectionMatrix();
    camera.position.set(1.0595364337361601,19.164145572555945,-10.864988785269247);
    viewer.cameraControls.target.set(1.1869623756602856, 17.752190898272897, -7.1836979194608706)
    camera.lookAt(viewer.cameraControls.target);
      loadResonaiPotree();
      break;
}
initGui();

function initGui() {
  gui = new GUI();

  const loadOptions = Object.fromEntries(Object.entries(DemoPotree).filter(([_, v]) => typeof v !== 'string'))
  gui.add(parameters, 'demoPotree', loadOptions).onChange(function (val: DemoPotree) {
    viewer.unload();
    switch (DemoPotree[val]) {
      case DemoPotree[DemoPotree.RESONAI_POTREE]:
        loadResonaiPotree();
        break;
    }
  });

  gui.add(parameters, 'budget', 1e3, 1e8).onChange(function (val: number) {
    pointClouds.forEach(pointCloud => {
      pointCloud.potree.pointBudget = val;
    })
  });

  gui.add(parameters, 'maxLevel', 0, 20).onChange(function (val: number) {
    pointClouds.forEach(pointCloud => {
      pointCloud.maxLevel = val;
    })
  });

  gui.add(parameters, 'minNodePixelSize', 20, 1000).onChange(function (val: number) {
    pointClouds.forEach(pointCloud => {
      pointCloud.minNodePixelSize = val;
    })
  });

  gui.add(parameters, 'points size', 0.05, 1.5).onChange(function (val: number) {
    pointClouds.forEach(pointCloud => {
      pointCloud.material.size = val;
    })
  });

  gui.add(parameters, 'clipping plane', -30, 100, 0.1).onChange(function (val: number) {
    clippingPlane.constant = -val;
  });

  const pointOpacityTypeDict = Object.fromEntries(Object.entries(PointOpacityType).filter(([_, v]) => typeof v !== 'string'))
  gui.add(parameters, 'pointOpacityType', pointOpacityTypeDict).onChange(function (val: PointOpacityType) {
    pointClouds.forEach(pointCloud => {
      pointCloud.material.pointOpacityType = val;
      pointCloud.material.transparent = true;
    })
  });
  const shapeDict = Object.fromEntries(Object.entries(PointShape).filter(([_, v]) => typeof v !== 'string'))
  gui.add(parameters, 'shape', shapeDict).onChange(function (val: PointShape) {
    pointClouds.forEach(pointCloud => {
      pointCloud.material.shape = Number(val);
    })
  });
  gui.add(parameters, 'highlightIgnoreDepth', false).onChange(function (val: boolean) {
    pointClouds.forEach(pointCloud => {
      pointCloud.material.setHighlightIgnoreDepth(val);
    })
  });
  const pointSizeTypeDict = Object.fromEntries(Object.entries(PointSizeType).filter(([_, v]) => typeof v !== 'string'))
  gui.add(parameters, 'pointSizeType', pointSizeTypeDict).onChange(function (val: PointSizeType) {
    pointClouds.forEach(pointCloud => {
      pointCloud.material.pointSizeType = Number(val);
    })
  });
  const pointColorTypeDict = Object.fromEntries(Object.entries(PointColorType).filter(([_, v]) => typeof v !== 'string'))
  gui.add(parameters, 'pointColorType', pointColorTypeDict).onChange(function (val: PointColorType) {
    pointClouds.forEach(pointCloud => {
      pointCloud.material.pointColorType = Number(val);
    })
  });
}
