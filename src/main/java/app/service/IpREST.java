/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package app.service;

import app.bc.IpBC;
import app.entity.Ip2location;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import javax.transaction.Transactional;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
import org.demoiselle.jee.persistence.crud.AbstractREST;
import org.demoiselle.jee.rest.annotation.CacheControl;
import org.demoiselle.jee.security.annotation.LoggedIn;
import org.demoiselle.jee.security.annotation.NotLogged;

/**
 *
 * @author gladson
 */
@LoggedIn
@Api("Location")
@Path("location")
public class IpREST extends AbstractREST<Ip2location, Long> {

    @GET
    @Path("ip/{ip}")
    @NotLogged
    @Transactional
    @CacheControl(value = "max-age=3600")
    @ApiOperation(value = "Retorna qual cidade o IP está ")
    public Response findIp(@PathParam("ip") String ip) {
        return Response.ok(((IpBC) bc).findIp(ip)).build();
    }

}
