package com.epam.indigoeln.core.repository.user;

import com.epam.indigoeln.core.model.Role;
import com.epam.indigoeln.core.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Collection;
import java.util.List;
import java.util.Set;

/**
 * Spring Data MongoDB repository for the User entity.
 */
public interface UserRepository extends MongoRepository<User, String> {

    User findOneByLogin(String login);

    User findOneByLoginAndActivated(String login, boolean activated);

    boolean existsByLogin(String login);

    @Query(value = "{'roles': {'$ref': '" + Role.COLLECTION_NAME + "', '$id': ?0}}", count = true)
    long countByRoleId(String roleId);

    @Query(value = "{'roles': {'$ref': '" + Role.COLLECTION_NAME + "', '$id': ?0}}")
    Collection<User> findByRoleId(String roleId);

    Set<User> findAllByRolesIdIn(List<String> roleIds);

    List<User> findAll(Iterable<String> ids);

    List<User> findByLoginIgnoreCaseLikeOrFirstNameIgnoreCaseLikeOrLastNameIgnoreCaseLikeOrRolesIdIn(
            String login,
            String firstName,
            String lastName,
            List<String> roleId
    );
}
