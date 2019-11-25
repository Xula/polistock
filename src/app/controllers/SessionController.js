import User from '../models/User';

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
    if (usuario.USER_TYPE === 1) {
      return res.status(200).json('/PainelAdmin');
    } else {
      return res.status(200).json('/PainelSecret');
    }
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
    const prod = false;
    const rotasExclusivasAdmin = ['/ListarMateriais', '/RelatorioSaidaMaterias', '/RelatorioMediasConsumo','/Cadastrar'];
    if (prod) {
      if (!req.session.usuario) {      
        return res.redirect('/');
      }
      else if (req.session.usuario.tipo === 2 && rotasExclusivasAdmin.includes(req.route.path)) {
        return res.redirect('/PainelSecret');
      }
    }    
    return next();
  }
}

export default new SessionController();