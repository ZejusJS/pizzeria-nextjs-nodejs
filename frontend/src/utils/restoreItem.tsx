import axios from 'axios'
import { server } from '../config/config'
import NProgress from 'nprogress'

export default async function restoreItem(e, id) {
    // e.stopPropagation()

    await axios({
        method: 'put',
        url: '/api/admin/restore-pizza',
        headers: {
            "Content-Type": "application/json",
        },
        params: {
            id
        },
        onUploadProgress: function (progressEvent) {
            NProgress.start()
        },
        onDownloadProgress: function (progressEvent) {
            NProgress.done(false)
        },
    })
        .then(res => console.log(res))
        .catch(e => console.error(e))

    return
}