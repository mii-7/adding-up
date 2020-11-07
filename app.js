'use strict';
const fs = require('fs');   // fs:FileSystem
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');  // Stream:非同期で情報を取り扱うための概念
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDataMap = new Map();  // key: 都道府県 value: 集計データのオブジェクト
// rlで'line'イベントが発生したら、無名関数を呼びだす（イベント駆動型プログラミング）
rl.on('line', lineString => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year == 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    // Array.from(連想関数)：普通の配列に変換
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    // map関数 !== 連想関数 Map
    // map関数：配列の各要素に処理を適用し、新しい関数を作成する
    const rankingStrings = rankingArray.map(([key, value]) => {
        return (
            key +
            ':' +
            value.popu10 +
            '=>' +
            value.popu15 +
            ' 変化率：' +
            value.change
        );
    });
    console.log(rankingStrings);
});