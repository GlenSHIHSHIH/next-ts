import Head from 'next/head';
import * as React from 'react';

interface HeaderTitle {
    title?: string,
    icon?: string,
    description?: string,
    url?: string,
    image?: string,
    json?: string
}

const HeaderTitle: React.FC<HeaderTitle> = (props) => {

    // header 敘述
    let defaultDescription =
        "κüოκüო選物店 ⭐ 好物推薦 安心購買" +
        "共同讓一成不變的生活變得有質感" +
        "❗全賣場滿 $1,500 免運費❗（全家 / 7-11)" +
        "_ κüოκüო購物須知，請務必遵守 _" +
        "📍全賣場商品均由韓國及日本直送，約7-21個工作天間出貨" +
        "📍手工類食品購買後若非食物變質不得退換" +
        "📍開箱請錄影，若無錄影憑證，任何毀損或缺少將不以賠償" +
        "📍不接受個人因素退換貨 (純粹不滿意、尺寸不合、非明顯色差...等等)" +
        "📍照片和實物可能稍有差異，完美主義者請三思" +
        "📍商品除有重大瑕疵，否則一經預定將不接受任何取消或是更改" +
        "♦ 回覆、出貨時間: 平日𝟬𝟵:𝟬𝟬～𝟮𝟬:𝟬𝟬" +
        "♦ 周末假日｜休假陪家人、陪愛人，將不定時回覆，請見諒" +
        "✦ ɪɴsᴛᴀɢʀᴀᴍ｜@kum.korea_kids" +
        "✦ ғᴀᴄᴇʙᴏᴏᴋ｜@kum.kum.korea" +
        "✦ 提供韓國童裝批發，可訊息聊聊洽談" +
        "如果覺得我們不錯 請給我們一個愛的鼓勵 🙇♀";


    const {
        title = process.env.DEFAULT_TITLE,
        icon = process.env.DEFAULT_ICON,
        description = defaultDescription,
        url,
        image,
        json,
    } = props;


    return (
        <Head>
            <title>{title}</title>
            <meta property="og:type" content="website" data-rh="true" />
            <meta property="og:title" content={title} data-rh="true" />
            <meta property="og:description" content={description} data-rh="true" />
            <meta property="og:url" content={url} data-rh="true" />
            <meta property="og:image" content={image} data-rh="true" />
            <meta name="description" content={description} data-rh="true" />
            <link rel="icon" href={icon} />
            <link rel="canonical" href={url} data-rh="true" />
            <script type="application/ld+json" data-rh="true">
                {json}
            </script>
        </Head>
    );
}
export default HeaderTitle;
