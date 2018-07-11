package io.zensoft.share.model;

/**
 * Created by temirlan on 7/5/18.
 */
public enum RequirementType {
    REQUIRED, OPTIONAL, GENERAL;

    public static RequirementType getByString(String s) {
        if (REQUIRED.name().equals(s)) {
            return REQUIRED;
        }
        if (OPTIONAL.name().equals(s)) {
            return OPTIONAL;
        }
        if (GENERAL.name().equals(s)) {
            return GENERAL;
        }
        return null;
    }
}
