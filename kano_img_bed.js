const fs = require('fs')
const axios = require('axios')
const path = require('path')
const FormData = require('form-data')
//域名
const domain = 'https://pan.kanokano.cn'
//上传目录
const uploadPath = '/阿里云の盘/Typora图床'

//图片上传接口
async function upload(path) {
    const form = new FormData();
    form.append('path', uploadPath);
    form.append('files', fs.createReadStream(path));
    let result = await axios.post(
        `${domain}/api/public/upload`,
        form,
        { headers: form.getHeaders() }
    ).then(
        (res) => {
            return true
        },
        (err) => {
            return false
        }
    )
    return result
}
function getLink(baseName) {
    axios.post(
        `${domain}/api/public/path`,
        { "path": uploadPath }
    ).then(
        (res) => {
            //请求成功
            let files = res.data.data.files
            files.forEach(fileName => {
                baseName.forEach(base => {
                    if (base == fileName.name) {
                        console.log(fileName.name);
                    }
                })
            })
        },
        (err) => {
            console.error(err.message);
        }
    )
}
async function main() {
    //获取参数
    let arguments = process.argv.splice(2)
    if (arguments[0] == '-upload') {
        let status = false
        //遍历上传图片
        for (let i = 1; i < arguments.length; i++) {
            //获取文件路径和文件名
            let fullpath = path.join(arguments[i])
            let baseName = (path.basename(arguments[i]))
            //上传图片
            status = await upload(fullpath)
            if (status) {
                console.log('https://pan.kanokano.cn/d' + uploadPath + '/' + baseName);
            } else {
                console.log(`${baseName}上传失败`)
                break
            }
        }

    } else {
        console.log('USAGE: -upload [path]');
    }
}
main();