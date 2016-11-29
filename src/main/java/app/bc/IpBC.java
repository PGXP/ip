/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package app.bc;

import app.dao.IpDAO;
import app.entity.Ip2location;
import org.demoiselle.jee.persistence.crud.AbstractBusiness;

/**
 *
 * @author 70744416353
 */
public class IpBC extends AbstractBusiness<Ip2location, Long> {

    public Ip2location findIp(String ip) {
        return ((IpDAO) dao).findIp(ip);
    }

}
