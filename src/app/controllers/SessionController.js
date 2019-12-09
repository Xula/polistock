import User from '../models/User';
import Lot from '../models/Lot';

import Sequelize from 'sequelize';
import databaseConfig from '../../config/database'
import moment from 'moment'

class SessionController {
  
  async login(req, res) {
    const { USER_LOGIN, USER_PASSWORD } = req.body
    const usuario = await User.findOne({
      where: {
        USER_LOGIN: USER_LOGIN
      }
    });
    if (!usuario || !(usuario.USER_PASSWORD === USER_PASSWORD)) {
      return res.status(400).json('Usuário ou senha incorreto');
    }
    req.session.usuario = {nome: usuario.USER_NAME, tipo: usuario.USER_TYPE, id: usuario.USER_ID};
    const dataAtual = moment();
    const dataAposUmMes = dataAtual.clone().add(1, 'month');
    const conn = new Sequelize(databaseConfig);
    const response = await conn.query(`SELECT "MATE_NAME", "LOT_QUANTITY", "LOT_VALIDITY", CASE WHEN "LOT_VALIDITY" < '${dataAtual.format("YYYY-MM-DD").toString()}' THEN TRUE ELSE FALSE END AS "VENCIDO" FROM "LOT" INNER JOIN "MATERIAL" ON "LOT"."MATE_ID" = "MATERIAL"."MATE_ID" WHERE "LOT_QUANTITY" > 0 AND "LOT_VALIDITY" <= '${dataAposUmMes.format("YYYY-MM-DD").toString()}' ORDER BY "LOT_VALIDITY"`)
    req.session.loteAviso = response[0];
    //console.log("querry ",req.session.loteAviso)
    return res.status(200).json('/SaidaMateriais');
  }
  
  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      return res.redirect('/');
    });
  }
  
  async guard(req, res, next) {
    const prod = true;
    const rotasExclusivasAdmin = ['/ListarMateriais', '/RelatorioSaidaMaterias', '/RelatorioMediasConsumo','/Cadastrar'];
    if (prod) {
      if (!req.session.usuario) {      
        return res.redirect('/');
      }
      else if (req.session.usuario.tipo === 2 && rotasExclusivasAdmin.includes(req.route.path)) {
        return res.redirect('/SaidaMateriais');
      }
    }    
    return next();
  }
}

export default new SessionController();