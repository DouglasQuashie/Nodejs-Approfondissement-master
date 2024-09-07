const articlesService = require("./articles.service");

class ArticlesController {

    async create(req, res, next){
        try {
            const article = await articlesService.create({...req.body, createdBy: req.user.id});
            req.io.emit("article:create", article);
            res.status(201).json(article);
        }
        catch(err)
        {next(err);}
    };

    async update(req, res, next){
        try{
            if (req.user.role !== 'admin') {
                return res.status(403).json({message: "Vous n'êtes pas Admin"})
            };
            const id = req.params.id;
            const data = req.body;
            const articleModified = await articlesService.update(id, data);
            req.io.emit("article:update", articleModified);
            res.json(articleModified);
        }
        catch(err)
        {next(err);}
    };

    async delete(req, res, next){
        try{
            if (req.user.role !== 'admin') {
                return res.status(403).json({message: "Vous n'êtes pas Admin"})
            };
            const id = req.params.id;
            await articlesService.delete(id);
            req.io.emit("article:delete", { id });
            res.status(204).send();
        }
        catch(err)
        {next(err);}
    };

}

module.exports = new ArticlesController();