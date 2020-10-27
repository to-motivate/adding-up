'use strict';
//モジュールの読み込み
const fs = require('fs');
const readline = require('readline');
//readstreamを作成
const rs = fs.createReadStream('./popu-pref.csv');
//インターフェースの設定
const rl = readline.createInterface({ 
    //読み込みたいストリームの設定
    input: rs,
    //書き出したいストリームの設定
　　output: {} 
})
//集計されたデータを格納する連想配列の設定
const prefectureDataMap = new Map(); //key: 都道府県　value: 集計データのオブジェクト
//一行ずつ読み込み設定
rl.on('line', lineString => {
    //カンマで区切られている文字列を分けて、配列に入れる
    const columns = lineString.split(',');
    //配列０を数値に変換して代入する
    const year = parseInt(columns[0]);
    //配列１を代入する
    const prefecture = columns[1];
    //配列３を数値に変換して代入する
    const popu = parseInt(columns[3]);
    //年代が2010年または2015年の時以下の処理を実行する
    if (year === 2010 || year === 2015) {
        //その都道府県のデータ(value)を取得する
        let value = prefectureDataMap.get(prefecture);
        //valueがFalsyならば、初期設定を行う
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
        if (year === 2015) {
            value.popu15 = popu;
        }
        //その都道府県のデータ(value)にデータを追加する
         prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) {
      value.change = value.popu15 / value.popu10;  
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value], i) => {
        return (
            '第' +
            (i + 1) +
            '位 ' +
            key +
            ': ' +
            value.popu10 +
            '=>' +
            value.popu15 +
            ' 変化率:' +
            value.change
        );
    });
    console.log(rankingStrings);
});
