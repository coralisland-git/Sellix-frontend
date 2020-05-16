import { authApi, formData } from 'utils'

export const createChangelog = (changelog) => () => {
    let data = {
        method: 'POST',
        url: `/admin/changelog/add`,
        data: formData(changelog),
    }

    return authApi(data).then(res => {
        if (res.status === 200) {
            return res
        } else {
            throw res
        }
    }).catch(err => {
        throw err
    })
}