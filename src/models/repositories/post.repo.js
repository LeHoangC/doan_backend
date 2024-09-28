const postModel = require('../post.model')

const searchPostByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)

    const result = await postModel
        .find(
            {
                post_type: 'public',
                $text: { $search: regexSearch },
            },
            {
                score: { $meta: 'textScore' },
            }
        )
        .sort({ score: { $meta: 'textScore' } })
        .limit(15)
        .lean()

    return result
}

module.exports = { searchPostByUser }
