/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package app.dao;

import app.entity.Ip2location;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.ws.rs.core.MultivaluedMap;
import org.demoiselle.jee.persistence.crud.AbstractDAO;

/**
 *
 * @author 70744416353
 */
public class IpDAO extends AbstractDAO<Ip2location, Long> {

    @PersistenceContext
    private EntityManager em;

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    @Override
    protected Predicate[] extractPredicates(MultivaluedMap<String, String> queryParameters,
            CriteriaBuilder criteriaBuilder, Root<Ip2location> root) {
        List<Predicate> predicates = new ArrayList<>();

        return predicates.toArray(new Predicate[]{});
    }

    public Ip2location findIp(String ip) {
        return (Ip2location) getEntityManager().createNativeQuery("select * from ip2location WHERE  INET_ATON(\"" + ip + "\") BETWEEN ip_from AND ip_to", Ip2location.class)
                .setMaxResults(10)
                .getSingleResult();
    }

}
